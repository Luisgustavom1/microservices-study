import { InsertOneResult, WithId } from "mongodb";
import { Listener } from "@contracts/Listener";
import { Service } from "@contracts/Service";
import { TransactionReplicateEventDTO } from "@event-bus/events/transaction.replicate.event";
import Transaction from "./db/collections/transaction";

export class QueryListener implements Listener {
  constructor(
    // TODO: dynamic methods params
    private readonly service: Service<InsertOneResult<Transaction>, WithId<Transaction>[]>,
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