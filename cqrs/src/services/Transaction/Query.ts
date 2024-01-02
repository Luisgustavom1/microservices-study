import { collections } from "../../db-read";
import { OptionalId } from "mongodb";
import Transaction from "../../db-read/collections/transaction";
import { Query } from "../Query";

export class TransactionQuery implements Query<Transaction> {
  private readonly db = collections.transaction;

  public async save(values: OptionalId<Transaction>) {
    return this.db?.insertOne(values)
  }

  public async list(wallet: string) {
    return collections.transaction?.find({ wallet }).sort({ createdAt: -1 }).limit(10).toArray();
  }
}