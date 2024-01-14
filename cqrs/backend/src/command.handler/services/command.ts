import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "@command.handler/db";
import { Transaction, transaction } from "@command.handler/db/schema/transaction";
import { Service } from ".";

export class TransactionCommand implements Service {
  private readonly db = db;

  public async save(values: MySqlInsertValue<Transaction>) {
    return this.db.insert(transaction).values(values);
  }
}