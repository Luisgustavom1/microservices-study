import { eq } from "drizzle-orm";
import { DepositDTO } from "../controllers/deposit";
import { db } from "../db";
import { account } from "../db/schema/account";
import { transaction } from "../db/schema/transaction";

export class DepositDomain {
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

  public list() {}
}