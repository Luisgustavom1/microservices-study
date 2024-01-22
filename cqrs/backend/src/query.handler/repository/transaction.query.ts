import { OptionalUnlessRequiredId } from "mongodb";
import { Transaction } from "@query.handler/models/Transaction";
import { collections } from "../db";
import { TransactionQueryRepository } from "./transaction.query.repository";

export class TransactionQuery implements TransactionQueryRepository {
  public async save(values: OptionalUnlessRequiredId<Transaction>) {
    return collections.transaction?.insertOne(values)
  }

  public async list(where: { wallet: string }) {
    return collections.transaction?.find(where).toArray();
  }
}