import { eq } from "drizzle-orm";
import { DepositDTO } from "../controllers/transaction";
import { db } from "../db";
import { account } from "../db/schema/account";
import { TransactionType } from "../db-read/collections/transaction";
import { BaseEvent } from "../event-bus/events/base.event";
import { TransactionEvent } from "../event-bus/events/transaction.event";
import { TransactionCommand } from "../services/Transaction/Command";
import { TransactionQuery } from "../services/Transaction/Query";

export class TransactionDomain {
  private readonly eventBus: BaseEvent = new TransactionEvent();
  private readonly command = new TransactionCommand();
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

      const [transactionCreated] = await this.command.save({
        accountId: accountToDeposit.id,
        currency: depositInput.currency,
        amount: String(depositInput.amount),
        type: "deposit",
      });

      this.eventBus.publish({ 
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
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }

  public withdraw() {}

  public async list(wallet: string) {
    try {
      const transactions = await this.query.list(wallet);

      return { success: true, data: transactions }
    } catch (error) {
      console.log("deu erro", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}