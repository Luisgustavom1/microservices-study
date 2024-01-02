import { eq } from "drizzle-orm";
import { DepositDTO } from "../controllers/transaction";
import { db } from "../db";
import { account } from "../db/schema/account";
import { transaction } from "../db/schema/transaction";
import { collections } from "../db-read";
import { TransactionType } from "../db-read/collections/transaction";

export class TransactionDomain {
  private readonly db = db;

  public async deposit(depositInput: DepositDTO) {
    try {
      const [accountToDeposit] = await db.select({
        id: account.id,
        wallet: account.wallet,
      }).from(account).where(
        eq(account.wallet, depositInput.wallet)
      );

      if (!accountToDeposit) {
        return { success: false, error: "Conta não encontrada" };
      }

      const [transactionCreated] = await this.db.insert(transaction).values({
        accountId: accountToDeposit.id,
        currency: depositInput.currency,
        amount: String(depositInput.amount),
        type: "deposit",
      });

      await collections.transaction?.insertOne({ 
        type: TransactionType.deposit, 
        transactionId: transactionCreated.insertId,
        currency: depositInput.currency, 
        amount: String(depositInput.amount), 
        wallet: accountToDeposit.wallet,
        created_at: new Date().getTime(), 
      })

      // eventual consistency when using a message broker
      return { success: true, id: transactionCreated.insertId }
    } catch (error) {
      console.log("deu erro", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }

  public withdraw() {}

  public async list(wallet: string) {
    try {
      const transactions = await collections.transaction?.find({ wallet }).sort({ createdAt: -1 }).limit(10).toArray();
      
      return { success: true, data: transactions }
    } catch (error) {
      console.log("deu erro", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}