import { InsertOneResult, OptionalUnlessRequiredId, WithId } from "mongodb";
import { Service } from "@contracts/Service";
import { collections } from "../db";
import Transaction from "../db/collections/transaction";

export class TransactionQuery implements Service<InsertOneResult<Transaction>, WithId<Transaction>[]> {
  private readonly db = collections.transaction;

  public async save(values: OptionalUnlessRequiredId<Transaction>) {
    return this.db?.insertOne(values)
  }

  public async list(wallet: string) {
    return collections.transaction?.find({ wallet }).toArray();
  }
}