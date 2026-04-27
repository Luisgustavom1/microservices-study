import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction';
import { TypeOrmTransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(TypeOrmTransactionEntity)
    private readonly transactionRepository: Repository<TypeOrmTransactionEntity>,
  ) {}

  async create(input: Transaction): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      originWalletId: input.originWalletId,
      destinationWalletId: input.destinationWalletId,
      amount: input.amount,
      status: input.status,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    return Transaction.create({
      id: savedTransaction.id,
      originWalletId: savedTransaction.originWalletId,
      destinationWalletId: savedTransaction.destinationWalletId,
      amount: savedTransaction.amount,
      status: savedTransaction.status,
      createdAt: savedTransaction.createdAt,
    });
  }
}
