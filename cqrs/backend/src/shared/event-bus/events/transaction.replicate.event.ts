import { BaseEvent } from "./base.event";
import { TransactionType } from '../../../query.handler/db/collections/transaction';

export class TransactionReplicateEvent extends BaseEvent {
  static readonly QUEUE_NAME = "transaction.replicate";

  constructor() {
    super(TransactionReplicateEvent.QUEUE_NAME);
  }

  public prepareMessage(message: TransactionReplicateEventDTO): TransactionReplicateEventDTO {
    return new TransactionReplicateEventDTO(
      message.type, 
      message.transactionId, 
      message.currency, 
      message.amount, 
      message.wallet, 
      message.created_at
    );
  }
}

export class TransactionReplicateEventDTO {
  constructor(
    public type: TransactionType, 
    public transactionId: number,
    public currency: string, 
    public amount: string, 
    public wallet: string,
    public created_at: number, 
  ) {}
}