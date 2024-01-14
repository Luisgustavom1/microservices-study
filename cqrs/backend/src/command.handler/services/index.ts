import { Transaction } from "@command.handler/db/schema/transaction";
import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export interface Service {
  save(values: MySqlInsertValue<Transaction>): Promise<MySqlRawQueryResult | undefined>;
}