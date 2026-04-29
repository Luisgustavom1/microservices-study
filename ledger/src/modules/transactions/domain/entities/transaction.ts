import { TransactionEvents } from '../events/events';
import { TransactionStartedDomainEvent } from '../events/transaction-started.domain-event';

export enum TransactionStatus {
  PENDING = 'PENDING',
}

export interface CreateTransactionProps {
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  status?: TransactionStatus;
  id?: string;
  createdAt?: Date;
  idempotencyKey: string;
}

export class Transaction {
  declare id: string;
  declare originWalletId: string;
  declare destinationWalletId: string;
  declare amount: string;
  declare status: TransactionStatus;
  declare createdAt: Date;
  declare idempotencyKey: string;
  private _domainEvents: TransactionStartedDomainEvent[] = [];

  private constructor(props: CreateTransactionProps) {
    this.id = props.id ?? '';
    this.originWalletId = props.originWalletId;
    this.destinationWalletId = props.destinationWalletId;
    this.amount = this.normalizeAmount(props.amount);
    this.status = props.status ?? TransactionStatus.PENDING;
    this.createdAt = props.createdAt ?? new Date();
    this.idempotencyKey = props.idempotencyKey;
  }

  static create(props: CreateTransactionProps): Transaction {
    return new Transaction(props);
  }

  private normalizeAmount(value: unknown): string {
    const amountValue = typeof value === 'string' ? Number(value) : value;

    if (
      typeof amountValue !== 'number' ||
      !Number.isFinite(amountValue) ||
      amountValue <= 0
    ) {
      throw new Error('amount must be a positive number');
    }

    return amountValue.toFixed(2);
  }

  validateBalance(walletBalance?: string): void {
    if (!walletBalance) {
      throw new Error(
        'amount must be less than or equal to origin wallet balance',
      );
    }

    if (Number(this.amount) > Number(walletBalance)) {
      throw new Error(
        'amount must be less than or equal to origin wallet balance',
      );
    }
  }

  start(walletBalance?: string): void {
    this._domainEvents.push(this.toStartTransactionDomainEvent());

    this.validateBalance(walletBalance);
    this.status = TransactionStatus.PENDING;
  }

  private toStartTransactionDomainEvent(): TransactionStartedDomainEvent {
    return {
      eventName: 'transaction-started',
      transactionId: this.id,
      originWalletId: this.originWalletId,
      destinationWalletId: this.destinationWalletId,
      amount: this.amount,
      status: this.status,
      occurredAt: this.createdAt.toISOString(),
    };
  }

  getDomainEvents(): TransactionEvents[] {
    return this._domainEvents.map((event) => ({
      ...event,
      // TODO: return to this, setting id after creation is a bit hacky, we should find a better way to handle this
      transactionId: this.id,
    }));
  }
}
