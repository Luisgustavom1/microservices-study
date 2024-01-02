import { Collection, ObjectId } from "mongodb";

export default class Transaction extends Collection {
  constructor(
    public id: ObjectId,
    public transactionId: number,
    public type: TransactionType,
    public wallet: string,
    public currency: string,
    public amount: string,
    public created_at: number,
  ) {
    super();
  }
}

export enum TransactionType {
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  transfer = 'transfer',
}