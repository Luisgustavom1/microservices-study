import { Listener } from "@event-bus/Listener";
import { TransactionReplicateEventDTO } from "@event-bus/events/transaction.replicate.event";
import { TransactionQueryRepository } from "@query.handler/repository";

export class QueryListener implements Listener {
  constructor(
    private readonly service: TransactionQueryRepository,
  ) {}

  async execute(values: TransactionReplicateEventDTO): Promise<void> {
    await this.service.save({
      type: values.type, 
      transactionId: values.transactionId,
      currency: values.currency, 
      amount: values.amount, 
      wallet: values.wallet,
      created_at: values.created_at,
    });
  }
}