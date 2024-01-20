import { transaction } from "@command.handler/db/schema/transaction";
import { Transaction } from "@command.handler/models/Transaction";
import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export interface TransactionCommandRepository {
  save(values: MySqlInsertValue<typeof transaction>): Promise<MySqlRawQueryResult | undefined>;
  list(accountId: number): Promise<Array<Transaction>>;
}