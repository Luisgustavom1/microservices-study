import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from '../../domain/entities/transaction';

@Entity({ name: 'transactions' })
export class TypeOrmTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column({ name: 'origin_wallet_id', type: 'uuid' })
  declare originWalletId: string;

  @Column({ name: 'destination_wallet_id', type: 'uuid' })
  declare destinationWalletId: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  declare amount: string;

  @Column({
    type: 'varchar',
    default: TransactionStatus.PENDING,
  })
  declare status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  declare createdAt: Date;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    length: 255,
  })
  declare idempotencyKey: string;
}
