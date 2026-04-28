import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction';
import type { StartTransactionRequest } from '../dto/start-transaction.request';
import { TransactionRepository } from '../../persistence/transaction/transaction.repository';
import { WalletRepository } from '../../../wallets/persistence/wallet.repository';
import { type TransactionStartedPublisher } from '../ports/transaction-started.publisher';
import { TRANSACTION_STARTED_PUBLISHER } from '../../domain/events/transaction-started.domain-event';

@Injectable()
export class StartTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
    @Inject(TRANSACTION_STARTED_PUBLISHER)
    private readonly transactionStartedPublisher: TransactionStartedPublisher,
  ) {}

  async execute(request: StartTransactionRequest) {
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

      transaction.start(originWallet.balance);

      const createdTransaction =
        await this.transactionRepository.create(transaction);

      // TODO: return to this, setting id after creation is a bit hacky, we should find a better way to handle this
      transaction.id = createdTransaction.id;

      await this.transactionStartedPublisher.publish(
        transaction.getDomainEvents()[0],
      );

      return {
        id: createdTransaction.id,
        status: createdTransaction.status,
        createdAt: createdTransaction.createdAt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Invalid transaction data');
    }
  }
}
