import { TransactionType } from "@command.handler/models/Transaction"; // TODO: not share models between command and query

export class Transaction {
  constructor(
    public transactionId: number,
    public type: TransactionType,
    public wallet: string,
    public currency: string,
    public amount: string,
    public created_at: number,
    public _id: string,
  ) {}
}