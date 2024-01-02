import { MySqlInsertValue } from "drizzle-orm/mysql-core";
import { db } from "../../db";
import { transaction } from "../../db/schema/transaction";

export class TransactionCommand {
  private readonly db = db;

  public async save(values: MySqlInsertValue<typeof transaction>) {
    return this.db.insert(transaction).values(values);
  }
}