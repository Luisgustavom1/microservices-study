import { BaseEvent } from "@event-bus/events/base.event";
import { QueryReplicateEventData } from "@shared/event-bus/events/query.replicate.event";
import { TransactionEvent, TransactionEventData } from "@event-bus/events/transaction.event";
import { Listener } from "@event-bus/Listener";
import { TransactionCommandRepository } from "@command.handler/repository/transaction.command.repository";
import { Reducer } from "@shared/reducer";
import { Account } from "./models/Account";
import { AccountCommandRepository } from "./repository/account.command.repository";
import { eq } from "drizzle-orm";
import { account } from "./db/schema/account";

export class CommandListener implements Listener {
  constructor (
    private readonly service: TransactionCommandRepository,
    private readonly eventBus: BaseEvent<QueryReplicateEventData>,
    private readonly accountRepo: AccountCommandRepository,
    private readonly reducer: Reducer<Account>
  ) {}

  async execute(values: TransactionEventData): Promise<void> {
    const amountParsed = String(values.amount);
    const createdAt = new Date();

    const [transactionCreated] = await this.service.save({
      accountId: values.accountId,
      currency: values.currency,
      amount: amountParsed,
      type: values.type,
      created_at: createdAt,
    }) || [];

    if (!transactionCreated) throw new Error('Transaction not created')

    const accountUpdated = await this.updateAccount(values.accountId, values.wallet)

    const newTransaction = {
      amount: amountParsed,
      wallet: values.wallet,
      type: values.type,
      currency: values.currency,
      transactionId: transactionCreated?.insertId,
      created_at: createdAt.getTime(),
    }

    const newAccount = {
      accountId: values.accountId,
      wallet: values.wallet,
      balance: accountUpdated.balance,
      opened_at: accountUpdated.opened_at.toISOString(),
      updated_at: accountUpdated.updated_at.toISOString(),
    }

    // TODO: use transaction to ensure consistency
    await this.dispatchNewEvent({ transaction: newTransaction, account: newAccount })
  }

  private async updateAccount(accountId: number, wallet: string) {
    const newAccount = await this.calculateNewAccountState(accountId, wallet)
    await this.accountRepo.update({
        balance: newAccount.balance,
        updated_at: new Date(),
      }, 
      eq(account.id, accountId)
    )
    return newAccount;
  }

  private async calculateNewAccountState(accountId: number, wallet: string): Promise<Account> {
    const account = await this.accountRepo.getById(accountId)
    if (!account) throw new Error('Account not found')

    if (!account.transactions) return account;

    const transactionEvents = account.transactions.map(({ amount, currency, type  }) => {
      // TODO: improve transaction event commit, not using the event bus
      const event = new TransactionEvent()
      event.prepareMessage({
        accountId,
        amount,
        currency,
        type,
        wallet,
      })
      return event
    })
    
    const accountToReduce = new Account(
      account.id,
      account.type,
      account.wallet,
      "0.00",
      account.opened_at,
      account.updated_at,
    )
    const accountReduced = this.reducer.reduce(accountToReduce, transactionEvents)

    return accountReduced
  }

  private async dispatchNewEvent(message: QueryReplicateEventData) {
    this.eventBus.prepareMessage(message)
    await this.eventBus.publish()
  }
}