import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateTransactionProps,
  Transaction,
} from '../../domain/entities/transaction';
import type { CreateTransactionIntentRequest } from '../dto/create-transaction-intent.request';
import { TransactionRepository } from '../../persistence/transaction/transaction.repository';
import { WalletRepository } from '../../../wallets/persistence/wallet.repository';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class CreateTransactionIntentUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(request: CreateTransactionIntentRequest): Promise<Transaction> {
    const originWalletId = this.normalizeUuid(
      request.originWalletId,
      'originWalletId',
    );
    const destinationWalletId = this.normalizeUuid(
      request.destinationWalletId,
      'destinationWalletId',
    );

    const originWalletBalance: string | null =
      await this.walletRepository.getBalance(originWalletId);

    if (!originWalletBalance) {
      throw new BadRequestException('originWalletId wallet not found');
    }

    const transaction = this.buildTransaction({
      originWalletId,
      destinationWalletId,
      amount: request.amount,
      originWalletBalance,
    });

    return this.transactionRepository.createIntent(transaction);
  }

  private normalizeUuid(value: unknown, fieldName: string): string {
    if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
      throw new BadRequestException(`${fieldName} must be a valid UUID`);
    }

    return value;
  }

  private buildTransaction(input: CreateTransactionProps): Transaction {
    try {
      return Transaction.create(input);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Invalid transaction data');
    }
  }
}
