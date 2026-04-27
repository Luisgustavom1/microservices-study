import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionsController } from './controller/transactions.controller';
import { StartTransactionUseCase } from './application/use-cases/start-transaction.use-case';
import { TypeOrmTransactionEntity } from './persistence/transaction/transaction.entity';
import { TransactionRepository } from './persistence/transaction/transaction.repository';
import { TRANSACTION_STARTED_PUBLISHER } from './domain/events/transaction-started.domain-event';
import { SnsTransactionStartedPublisher } from './messaging/transaction-started.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTransactionEntity]),
    WalletsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    StartTransactionUseCase,
    TransactionRepository,
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
