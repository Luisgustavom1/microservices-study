import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionsTable1777234553790 implements MigrationInterface {
  name = 'CreateTransactionsTable1777234553790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS "transactions"');
    await queryRunner.query(`
      CREATE TABLE "transactions"."transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "origin_wallet_id" uuid NOT NULL,
        "destination_wallet_id" uuid NOT NULL,
        "amount" numeric(18,2) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "transactions"."transactions"');
  }
}
