import { Listener } from "@event-bus/Listener";
import { TransactionReplicateEventData } from "@event-bus/events/transaction.replicate.event";
import { TransactionQueryRepository } from "@query.handler/repository/transaction.query.repository";

export class QueryListener implements Listener {
  constructor(
    private readonly service: TransactionQueryRepository,
  ) {}

  async execute(values: TransactionReplicateEventData): Promise<void> {
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