import { Transaction } from "@command.handler/models/Transaction";
import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export interface TransactionCommandRepository {
  save(values: MySqlInsertValue<Transaction>): Promise<MySqlRawQueryResult | undefined>;
}