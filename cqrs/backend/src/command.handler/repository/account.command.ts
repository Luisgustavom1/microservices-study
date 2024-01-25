import { Account } from "@command.handler/models/Account";
import { AccountCommandRepository } from "./account.command.repository";
import { account } from "@command.handler/db/schema/account";
import { SQL, eq } from "drizzle-orm";
import { db } from "@command.handler/db";
import { transaction } from "@command.handler/db/schema/transaction";
import { MySqlUpdateSetSource } from "drizzle-orm/mysql-core";

export class AccountCommand implements AccountCommandRepository {
  private readonly db = db;

  async update(set: MySqlUpdateSetSource<typeof account>, where: SQL): Promise<any> {
    return this.db.update(account).set(set).where(where)
  }

  async list(): Promise<Account[]> {
    const rows = await this.db.select().from(account)
    return rows
  }

  async getByWallet(wallet: string): Promise<Account | undefined> {
    const [row] = await this.db.select({ account }).from(account).where(
      eq(account.wallet, wallet)
    ).limit(1)

    return row.account
  }

  async getById(accountId: number): Promise<Account | undefined> {
    const rows = await this.db.select({
      id: account.id,
      wallet: account.wallet,
      balance: account.balance,
      type: account.type,
      opened_at: account.opened_at,
      updated_at: account.updated_at,
      transaction: transaction
    }).from(account).where(
      eq(account.id, accountId)
    ).innerJoin(transaction, eq(account.id, transaction.accountId))
    
    const result = rows.reduce<Account | undefined>(
      (acc, row) => {
        if (!acc) {
          return {
            id: row.id,
            wallet: row.wallet,
            balance: row.balance,
            type: row.type,
            opened_at: row.opened_at,
            updated_at: row.updated_at,
            transactions: [row.transaction]
          }
        }

        acc.transactions?.push(row.transaction)

        return acc;
      },
      undefined
    );

    return result
  }
}