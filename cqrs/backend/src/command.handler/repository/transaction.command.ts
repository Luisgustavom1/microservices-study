import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "@command.handler/db";
import { TransactionCommandRepository } from "./transaction.command.repository";
import { transaction } from "@command.handler/db/schema/transaction";
import { eq } from "drizzle-orm";
import { Transaction } from "@command.handler/models/Transaction";

export class TransactionCommand implements TransactionCommandRepository {
  private readonly db = db;

  public async save(values: MySqlInsertValue<typeof transaction>) {
    return this.db.insert(transaction).values(values);
  }

  public async list(accountId: number): Promise<Array<Transaction>> {
    return this.db.select({
      id: transaction.id,
      accountId: transaction.accountId,
      currency: transaction.currency,
      amount: transaction.amount,
      type: transaction.type,
      created_at: transaction.created_at,
    }).from(transaction).where(
      eq(transaction.accountId, accountId)
    )
  }
}