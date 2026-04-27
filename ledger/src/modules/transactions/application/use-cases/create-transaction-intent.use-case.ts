import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction';
import type { CreateTransactionIntentRequest } from '../dto/create-transaction-intent.request';
import { TransactionRepository } from '../../persistence/transaction/transaction.repository';
import { WalletRepository } from '../../../wallets/persistence/wallet.repository';

@Injectable()
export class CreateTransactionIntentUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(request: CreateTransactionIntentRequest): Promise<Transaction> {
    try {
      const originWalletId = request.originWalletId;
      const destinationWalletId = request.destinationWalletId;

      if (originWalletId === destinationWalletId) {
        throw new BadRequestException(
          'originWalletId and destinationWalletId must be different',
        );
      }

      const [originWallet, destinationWallet] = await Promise.all([
        this.walletRepository.getById(originWalletId),
        this.walletRepository.getById(destinationWalletId),
      ]);

      if (!originWallet) {
        throw new BadRequestException('originWalletId wallet not found');
      }

      if (!destinationWallet) {
        throw new BadRequestException('destinationWalletId wallet not found');
      }

      const transaction = Transaction.create({
        originWalletId,
        destinationWalletId,
        amount: request.amount,
      });

      transaction.validateBalance(originWallet.balance);

      return this.transactionRepository.createIntent(transaction);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Invalid transaction data');
    }
  }
}
