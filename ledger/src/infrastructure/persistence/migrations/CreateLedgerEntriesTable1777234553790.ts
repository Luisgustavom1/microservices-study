import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLedgerEntriesTable1777234553790 implements MigrationInterface {
  name = 'CreateLedgerEntriesTable1777234553790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ledger_entries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "wallet_id" uuid NOT NULL,
        "amount" numeric(18,2) NOT NULL,
        "type" character varying NOT NULL,
        CONSTRAINT "PK_ledger_entries_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ledger_entries_wallet" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "ledger_entries"');
  }
}
