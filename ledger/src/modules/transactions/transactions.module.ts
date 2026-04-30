import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controller/transactions.controller';
import { StartTransactionUseCase } from './application/use-cases/start-transaction.use-case';
import { TypeOrmTransactionEntity } from './infrastructure/transaction/transaction.entity';
import { TransactionRepository } from './infrastructure/transaction/transaction.repository';
import { TRANSACTION_STARTED_PUBLISHER } from './domain/events/transaction-started.domain-event';
import { SnsTransactionStartedPublisher } from './messaging/transaction-started.publisher';
import { LedgerWalletReader } from './infrastructure/wallets/ledger-wallet.reader';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmTransactionEntity])],
  controllers: [TransactionsController],
  providers: [
    StartTransactionUseCase,
    TransactionRepository,
    {
      provide: LedgerWalletReader,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ledgerServiceUrl = configService.get<string>(
          'LEDGER_SERVICE_URL',
          'http://localhost:3001',
        );

        return new LedgerWalletReader(ledgerServiceUrl);
      },
    },
    {
      provide: TRANSACTION_STARTED_PUBLISHER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const topicArn = configService.get<string>(
          'AWS_SNS_TRANSACTION_STARTED_TOPIC_ARN',
        );
        const region = configService.get<string>('AWS_REGION', 'us-east-1');

        if (!topicArn)
          throw new Error(
            'AWS_SNS_TRANSACTION_STARTED_TOPIC_ARN is not defined',
          );

        return new SnsTransactionStartedPublisher(topicArn, region);
      },
    },
  ],
})
export class TransactionsModule {}
