import { sql } from "drizzle-orm";
import { decimal, mysqlTable, timestamp, mysqlEnum, int, varchar } from "drizzle-orm/mysql-core";

export const account = mysqlTable('account', {
  id: int("id").primaryKey().autoincrement(),  
  type: mysqlEnum("type", ['checking', 'savings', 'investment']).notNull(),
  wallet: varchar('wallet', { length: 16 }).unique().notNull(),
  balance: decimal("balance", {
    precision: 15,
    scale: 2,
  }).default('0.00'),
  opened_at: timestamp("opened_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
