import { BaseEvent } from "./base.event";
import { TransactionType } from '@command.handler/models/Transaction';

export class TransactionReplicateEvent extends BaseEvent<TransactionReplicateEventData> {
  static readonly QUEUE_NAME = "transaction.replicate";

  constructor() {
    super(TransactionReplicateEvent.QUEUE_NAME);
  }

  public prepareMessage(message: TransactionReplicateEventData) {
    this.data = new TransactionReplicateEventData(
      message.type, 
      message.transactionId, 
      message.currency, 
      message.amount, 
      message.wallet, 
      message.created_at
    );
  }
}

export class TransactionReplicateEventData {
  constructor(
    public type: TransactionType, 
    public transactionId: number,
    public currency: string, 
    public amount: string, 
    public wallet: string,
    public created_at: number, 
  ) {}
}