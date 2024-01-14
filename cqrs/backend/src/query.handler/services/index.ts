import { InsertOneResult, OptionalId, WithId } from "mongodb";
import Transaction from "@query.handler/db/collections/transaction";

export interface Service {
  save(values: OptionalId<Transaction>): Promise<InsertOneResult<Transaction> | undefined>;
  list(where: { wallet: string }): Promise<WithId<Transaction>[] | undefined> ;
}