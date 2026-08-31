import type { Knex } from "knex";

const config: Knex.Config = {
  client: "postgresql",
  connection: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/agentic_gateway",
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
    extension: "ts",
  },
};

export default config;
