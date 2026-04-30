import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionidempotencyKey1777376519079 implements MigrationInterface {
  name = 'TransactionidempotencyKey1777376519079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "transactions"."transactions"
      ADD COLUMN "idempotency_key" character varying(255) not null
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_transactions_idempotency_key" ON "transactions"."transactions" ("idempotency_key")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_transactions_idempotency_key"
    `);

    await queryRunner.query(`
      ALTER TABLE "transactions"."transactions"
      DROP COLUMN "idempotency_key"
    `);
  }
}
