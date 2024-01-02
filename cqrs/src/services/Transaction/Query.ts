import { InsertOneResult, OptionalUnlessRequiredId, WithId } from "mongodb";
import { collections } from "../../db-read";
import Transaction from "../../db-read/collections/transaction";
import { Service } from "../Service";

export class TransactionQuery implements Service<InsertOneResult<Transaction>, WithId<Transaction>[]> {
  private readonly db = collections.transaction;

  public async save(values: OptionalUnlessRequiredId<Transaction>) {
    return this.db?.insertOne(values)
  }

  public async list(wallet: string) {
    return collections.transaction?.find({ wallet }).toArray();
  }
}