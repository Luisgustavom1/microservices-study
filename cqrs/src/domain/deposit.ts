import { eq } from "drizzle-orm";
import { DepositDTO } from "../controllers/transaction";
import { db } from "../db";
import { account } from "../db/schema/account";
import { transaction } from "../db/schema/transaction";

export class TransactionDomain {
  private readonly db = db;

  public async deposit(depositInput: DepositDTO) {
    try {
      const [accountToDeposit] = await db.select({
        id: account.id,
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
      const transactions = await db
        .select({
          id: transaction.id,
          type: transaction.type,
          currency: transaction.currency,
          amount: transaction.amount,
          created_at: transaction.created_at,
        })
        .from(transaction)
        .innerJoin(account, eq(transaction.accountId, account.id))
        .where(eq(account.wallet, wallet))
      
      return { success: true, data: transactions }
    } catch (error) {
      console.log("deu erro", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}