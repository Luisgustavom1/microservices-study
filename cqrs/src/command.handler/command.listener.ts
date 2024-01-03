import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { BaseEvent } from "@event-bus/events/base.event";
import { TransactionReplicateEventDTO } from "@event-bus/events/transaction.replicate.event";
import { DepositEventDTO } from "@event-bus/events/deposit.event";
import { Listener } from "@contracts/Listener";
import { Service } from "@command.handler/services";

export class CommandListener implements Listener {
  constructor (
    private readonly service: Service,
    private readonly eventBus: BaseEvent<TransactionReplicateEventDTO>,
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