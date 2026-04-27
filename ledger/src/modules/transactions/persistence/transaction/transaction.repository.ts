import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction';
import { TypeOrmTransactionEntity } from './transaction.entity';

export interface CreateTransactionIntentInput {
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  status: TransactionStatus;
}

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TypeOrmTransactionEntity)
    private readonly transactionRepository: Repository<TypeOrmTransactionEntity>,
  ) {}

  async createIntent(
    input: CreateTransactionIntentInput,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...input,
    });
    const savedTransaction = await this.transactionRepository.save(transaction);

    return {
      id: savedTransaction.id,
      originWalletId: savedTransaction.originWalletId,
      destinationWalletId: savedTransaction.destinationWalletId,
      amount: savedTransaction.amount,
      status: savedTransaction.status,
      createdAt: savedTransaction.createdAt,
    };
  }
}
