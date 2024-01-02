import { Listener } from "../listener";
import { Service } from "../../services/Service";
import { InsertOneResult, OptionalId, OptionalUnlessRequiredId, WithId } from "mongodb";
import { TransactionEventDTO } from "../../event-bus/events/transaction.event";
import Transaction from "../../db-read/collections/transaction";

export class QueryListener implements Listener {
  constructor(
    // TODO: dynamic methods params
    private readonly service:Service<InsertOneResult<Transaction>, WithId<Transaction>[]>,
  ) {}

  async execute(values: TransactionEventDTO): Promise<void> {
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