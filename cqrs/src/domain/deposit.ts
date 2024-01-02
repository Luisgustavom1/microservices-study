import { eq } from "drizzle-orm";
import { DepositDTO } from "../controllers/transaction";
import { db } from "../db";
import { account } from "../db/schema/account";
import { TransactionQuery } from "../services/transaction/query";
import { DepositEvent } from "../event-bus/events/deposit.event";

export class TransactionDomain {
  // TODO: inject dependencies
  private readonly depositBus = new DepositEvent();
  private readonly query = new TransactionQuery();

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

      const message = this.depositBus.prepareMessage({ 
        accountId: accountToDeposit.id,
        currency: depositInput.currency, 
        amount: depositInput.amount, 
        wallet: accountToDeposit.wallet,
      })
      this.depositBus.publish(message)

      // eventual consistency when using a message broker
      return { success: true }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }

  public withdraw() {}

  public async list(wallet: string) {
    try {
      const transactions = await this.query.list(wallet);
      
      return { success: true, count: transactions?.length, data: transactions }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}