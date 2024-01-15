import { eq } from "drizzle-orm";
import { TransactionDTO } from "../controllers/transaction";
import { db } from "@command.handler/db";
import { account } from "@command.handler/db/schema/account";
import { TransactionEvent } from "@event-bus/events/transaction.event";
import { TransactionQueryRepository } from "@query.handler/repository";
import { TransactionType } from "@query.handler/models/Transaction";

export class TransactionDomain {
  private readonly transactionBus = new TransactionEvent();
  
  constructor (
    private readonly query: TransactionQueryRepository
  ) {}

  public async deposit(depositInput: TransactionDTO) {
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

      const message = this.transactionBus.prepareMessage({ 
        type: TransactionType.deposit,
        accountId: accountToDeposit.id,
        currency: depositInput.currency, 
        amount: depositInput.amount, 
        wallet: accountToDeposit.wallet,
      })
      this.transactionBus.publish(message)

      // eventual consistency when using a message broker
      return { success: true }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  } 

  public async withdraw(withdrawInput: TransactionDTO) {
    try {
      const [accountToDeposit] = await db.select({
        id: account.id,
        wallet: account.wallet,
        balance: account.balance,
      }).from(account).where(
        eq(account.wallet, withdrawInput.wallet)
      );

      if (!accountToDeposit) {
        return { success: false, error: "Conta não encontrada" };
      }

      const insufficientBalance = Number(accountToDeposit.balance) <  withdrawInput.amount
      if (insufficientBalance) {
        return { success: false, error: "Saldo insuficiente" };
      }

      const message = this.transactionBus.prepareMessage({ 
        type: TransactionType.withdrawal,
        accountId: accountToDeposit.id,
        currency: withdrawInput.currency, 
        amount: withdrawInput.amount, 
        wallet: accountToDeposit.wallet,
      })
      this.transactionBus.publish(message)

      // eventual consistency when using a message broker
      return { success: true }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }

  public async list(wallet: string) {
    try {
      const transactions = await this.query.list({ wallet });
      
      return { success: true, count: transactions?.length, data: transactions }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}