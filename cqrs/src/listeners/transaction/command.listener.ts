import { Listener } from "../listener";
import { Service } from "../../services/Service";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { BaseEvent } from "../../event-bus/events/base.event";
import { TransactionEventDTO } from "../../event-bus/events/transaction.replicate.event";
import { DepositEventDTO } from "../../event-bus/events/deposit.event";

export class CommandListener implements Listener {
  constructor (
    // TODO: dynamic methods params
    private readonly service: Service<MySqlRawQueryResult>,
    private readonly eventBus: BaseEvent<TransactionEventDTO>,
  ) {}

  async execute(values: DepositEventDTO): Promise<void> {
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

    const message = this.eventBus.prepareMessage({
      amount: amountParsed,
      wallet: values.wallet,
      type: values.type,
      currency: values.currency,
      transactionId: transactionCreated?.insertId,
      created_at: createdAt.getTime(),
    })
    await this.eventBus.publish(message)
  }
}