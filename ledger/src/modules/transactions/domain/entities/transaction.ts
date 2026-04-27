export enum TransactionStatus {
  PENDING = 'PENDING',
}

export interface CreateTransactionProps {
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  originWalletBalance?: string;
  status?: TransactionStatus;
  id?: string;
  createdAt?: Date;
}

export class Transaction {
  declare id: string;
  declare originWalletId: string;
  declare destinationWalletId: string;
  declare amount: string;
  declare status: TransactionStatus;
  declare createdAt: Date;

  private constructor(props: CreateTransactionProps) {
    this.id = props.id ?? '';
    this.originWalletId = props.originWalletId;
    this.destinationWalletId = props.destinationWalletId;
    this.amount = this.normalizeAmount(props.amount);
    this.status = props.status ?? TransactionStatus.PENDING;
    this.createdAt = props.createdAt ?? new Date();

    this.validateInvariants(props.originWalletBalance);
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

  private validateInvariants(walletBalance?: unknown): void {
    if (this.originWalletId === this.destinationWalletId) {
      throw new Error(
        'originWalletId and destinationWalletId must be different',
      );
    }

    if (Number(this.amount) > Number(walletBalance)) {
      throw new Error(
        'amount must be less than or equal to origin wallet balance',
      );
    }
  }
}
