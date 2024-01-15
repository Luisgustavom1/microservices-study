import { BaseEvent } from "@event-bus/events/base.event";
import { TransactionReplicateEventData } from "@event-bus/events/transaction.replicate.event";
import { TransactionEventData } from "@event-bus/events/transaction.event";
import { Listener } from "@event-bus/Listener";
import { TransactionCommandRepository } from "@command.handler/repository";

export class CommandListener implements Listener {
  constructor (
    private readonly service: TransactionCommandRepository,
    private readonly eventBus: BaseEvent<TransactionReplicateEventData>,
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

    this.eventBus.prepareMessage({
      amount: amountParsed,
      wallet: values.wallet,
      type: values.type,
      currency: values.currency,
      transactionId: transactionCreated?.insertId,
      created_at: createdAt.getTime(),
    })
    await this.eventBus.publish()
  }
}