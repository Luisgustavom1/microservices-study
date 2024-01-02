import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "../../db";
import { Transaction, transaction } from "../../db/schema/transaction";
import { Service } from "../Service";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export class TransactionCommand implements Service<MySqlRawQueryResult, void> {
  private readonly db = db;

  public async save(values: MySqlInsertValue<Transaction>) {
    return this.db.insert(transaction).values(values);
  }

  list(_where: unknown): Promise<void | undefined> {
    throw new Error("Method not implemented.");
  }
}