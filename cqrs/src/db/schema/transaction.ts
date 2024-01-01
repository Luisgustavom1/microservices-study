import { sql } from "drizzle-orm";
import { int, decimal, mysqlTable, timestamp, mysqlEnum, varchar } from "drizzle-orm/mysql-core";
import { account } from "./account";

export const transaction = mysqlTable('transaction', {
  id: int("id").primaryKey().autoincrement(),
  accountId: int("accountId").notNull().references(() => account.id),
  type: mysqlEnum("type", ['deposit', 'withdrawal', 'transfer']).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  amount: decimal("balance", {
    precision: 15,
    scale: 2,
  }).default('0.00'),
  created_at: timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});