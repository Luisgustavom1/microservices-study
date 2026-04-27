import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'wallets' })
export class WalletEntity {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('numeric', { precision: 19, scale: 2 })
  declare balance: string;

  @CreateDateColumn()
  declare createdAt: Date;
}
