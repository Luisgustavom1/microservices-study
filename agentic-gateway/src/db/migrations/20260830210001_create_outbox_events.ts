import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("outbox_events", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("aggregate_type").notNullable();
    table.uuid("aggregate_id").notNullable();
    table.string("event_type").notNullable();
    table.jsonb("payload").notNullable();
    table.enum("status", ["PENDING", "PUBLISHED", "FAILED"]).notNullable().defaultTo("PENDING");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("processed_at").nullable();
    
    table.index(["status", "created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("outbox_events");
}
