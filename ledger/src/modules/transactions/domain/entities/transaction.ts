export enum TransactionStatus {
  PENDING = 'PENDING',
}

export class Transaction {
  declare id: string;
  declare originWalletId: string;
  declare destinationWalletId: string;
  declare amount: string;
  declare status: TransactionStatus;
  declare createdAt: Date;

  static normalizeAmount(value: unknown): string {
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
}
