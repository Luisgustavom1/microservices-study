import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsController } from './controller/transactions.controller';
import { CreateTransactionIntentUseCase } from './application/use-cases/create-transaction-intent.use-case';
import { TypeOrmTransactionEntity } from './persistence/transaction/transaction.entity';
import { TransactionRepository } from './persistence/transaction/transaction.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTransactionEntity]),
    WalletsModule,
  ],
  controllers: [TransactionsController],
  providers: [CreateTransactionIntentUseCase, TransactionRepository],
})
export class TransactionsModule {}
