import { sql } from "drizzle-orm";
import { int, decimal, mysqlTable, timestamp, mysqlEnum, varchar } from "drizzle-orm/mysql-core";
import { account } from "./account";
import { TransactionType } from "@command.handler/models/Transaction";

export const transaction = mysqlTable('transaction', {
  id: int("id").primaryKey().autoincrement(),
  accountId: int("accountId").notNull().references(() => account.id),
  type: mysqlEnum("type", [TransactionType.deposit, TransactionType.withdrawal, TransactionType.transfer]).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  amount: decimal("balance", {
    precision: 15,
    scale: 2,
  }).default('0.00').notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});