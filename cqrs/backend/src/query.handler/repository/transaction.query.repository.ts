import { InsertOneResult, OptionalId, WithId } from "mongodb";
import { Transaction } from "@query.handler/models/Transaction";

export interface TransactionQueryRepository {
  save(values: OptionalId<Transaction>): Promise<InsertOneResult<Transaction> | undefined>;
  list(where: { wallet: string }): Promise<WithId<Transaction>[] | undefined> ;
}