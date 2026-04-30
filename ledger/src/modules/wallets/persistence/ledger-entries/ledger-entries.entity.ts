import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'wallets', name: 'ledger_entries' })
export class LedgerEntriesEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ name: 'wallet_id', type: 'uuid' })
  declare walletId: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  declare amount: string;

  @Column({ type: 'varchar' })
  declare type: string;
}
