import { BaseEvent } from "./base.event";
import { TransactionType } from '../../../query.handler/db/collections/transaction';

export class TransactionEvent extends BaseEvent {
  static readonly QUEUE_NAME = "transaction";

  constructor() {
    super(TransactionEvent.QUEUE_NAME);
  }

  public prepareMessage(message: TransactionEventDTO): TransactionEventDTO {
    return new TransactionEventDTO(
      message.type, 
      message.accountId,
      message.amount, 
      message.currency, 
      message.wallet, 
    );
  }
}
export class TransactionEventDTO {
  constructor(
    public type: TransactionType,
    public accountId: number,
    public amount: number, 
    public currency: string, 
    public wallet: string,
  ) {}
}