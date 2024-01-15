import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "@command.handler/db";
import { Transaction } from "@command.handler/models/Transaction";
import { TransactionCommandRepository } from ".";
import { transaction } from "@command.handler/db/schema/transaction";

export class TransactionCommand implements TransactionCommandRepository {
  private readonly db = db;

  public async save(values: MySqlInsertValue<Transaction>) {
    return this.db.insert(transaction).values(values);
  }
}