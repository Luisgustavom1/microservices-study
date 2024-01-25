import { account } from "@command.handler/db/schema/account";
import { Account } from "@command.handler/models/Account";
import { SQL } from "drizzle-orm";
import { MySqlUpdateSetSource } from "drizzle-orm/mysql-core";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export interface AccountCommandRepository {
  getById(accountId: number): Promise<Account | undefined>;
  getByWallet(wallet: string): Promise<Account | undefined>;
  update(set: MySqlUpdateSetSource<typeof account>, where: SQL): Promise<MySqlRawQueryResult | undefined>;
  list(): Promise<Account[]>;
}