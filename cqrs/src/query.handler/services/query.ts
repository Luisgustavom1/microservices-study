import { OptionalUnlessRequiredId } from "mongodb";
import Transaction from "@query.handler/db/collections/transaction";
import { collections } from "../db";
import { Service } from ".";

export class TransactionQuery implements Service {
  private readonly db = collections.transaction;

  public async save(values: OptionalUnlessRequiredId<Transaction>) {
    return this.db?.insertOne(values)
  }

  public async list(where: { wallet: string }) {
    return collections.transaction?.find(where).toArray();
  }
}