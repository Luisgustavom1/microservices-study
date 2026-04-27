import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'wallets' })
export class WalletEntity {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('varchar')
  declare email: string;

  @Column('numeric', { precision: 19, scale: 2 })
  declare balance: string;
}
