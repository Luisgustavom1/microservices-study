import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "@command.handler/db";
import { TransactionCommandRepository } from "./transaction.command.repository";
import { transaction } from "@command.handler/db/schema/transaction";

export class TransactionCommand implements TransactionCommandRepository {
  private readonly db = db;

  public async save(values: MySqlInsertValue<typeof transaction>) {
    return this.db.insert(transaction).values(values);
  }
}