import { drizzle } from "drizzle-orm/mysql2";
import { createPool as mysqlCreatePool } from "mysql2/promise";

export const connection = mysqlCreatePool({
  host: process.env["DATABASE_HOST"],
  user: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
  database: process.env["DATABASE"],
});

export const db = drizzle(connection);