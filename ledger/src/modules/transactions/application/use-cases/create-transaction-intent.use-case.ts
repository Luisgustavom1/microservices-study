import { BadRequestException, Injectable } from '@nestjs/common';
import type { Transaction } from '../../domain/entities/transaction';
import {
  Transaction as TransactionEntity,
  TransactionStatus,
} from '../../domain/entities/transaction';
import type { CreateTransactionIntentRequest } from '../dto/create-transaction-intent.request';
import { TransactionRepository } from '../../persistence/transaction/transaction.repository';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class CreateTransactionIntentUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(request: CreateTransactionIntentRequest): Promise<Transaction> {
    const originWalletId = this.normalizeUuid(
      request.originWalletId,
      'originWalletId',
    );
    const destinationWalletId = this.normalizeUuid(
      request.destinationWalletId,
      'destinationWalletId',
    );
    const amount = this.normalizeAmount(request.amount);

    if (originWalletId === destinationWalletId) {
      throw new BadRequestException(
        'originWalletId and destinationWalletId must be different',
      );
    }

    return this.transactionRepository.createIntent({
      originWalletId,
      destinationWalletId,
      amount,
      status: TransactionStatus.PENDING,
    });
  }

  private normalizeUuid(value: unknown, fieldName: string): string {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new BadRequestException(`${fieldName} must be a valid UUID`);
    }

    return value;
  }

  private normalizeAmount(value: unknown): string {
    try {
      return TransactionEntity.normalizeAmount(value);
    } catch {
      throw new BadRequestException('amount must be a positive number');
    }
  }
}
