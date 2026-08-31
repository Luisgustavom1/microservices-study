import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("messages", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("external_id").notNullable().unique();
    table.string("customer_identifier").notNullable();
    table.text("content").notNullable();
    table.enum("status", ["RECEIVED", "PROCESSING", "RESOLVED", "ESCALATED"]).notNullable().defaultTo("RECEIVED");
    table.timestamps(true, true);
    
    table.index(["customer_identifier"]);
    table.index(["status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("messages");
}
