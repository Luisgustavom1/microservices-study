export interface Transaction {
  transactionId: number;
  type: TransactionType;
  wallet: string;
  currency: string;
  amount: string;
  created_at: number;
  _id: string;
}

export enum TransactionType {
  deposit = "deposit",
  withdrawal = "withdrawal",
  transfer = "transfer",
}
