import { BaseEvent } from "./base.event";
import { TransactionType } from '../../db-read/collections/transaction';

export class TransactionEvent extends BaseEvent {
  constructor() {
    super("transaction.replicate");
  }

  public prepareMessage(message: TransactionEventDTO): TransactionEventDTO {
    return new TransactionEventDTO(
      message.type, 
      message.transactionId, 
      message.currency, 
      message.amount, 
      message.wallet, 
      message.created_at
    );
  }
}

export class TransactionEventDTO {
  constructor(
    public type: TransactionType, 
    public transactionId: number,
    public currency: string, 
    public amount: string, 
    public wallet: string,
    public created_at: number, 
  ) {}
}