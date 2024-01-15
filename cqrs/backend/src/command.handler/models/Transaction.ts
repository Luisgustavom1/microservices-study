export class Transaction {
  constructor(
    public id: number,
    public accountId: number,
    public type: TransactionType,
    public currency: string,
    public amount: string,
    public created_at: string,
  ) {}
}

export enum TransactionType {
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  transfer = 'transfer',
}