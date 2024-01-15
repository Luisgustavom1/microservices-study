import { Account } from "@command.handler/models/Account";
import { BaseEvent } from "./base.event";
import { TransactionType } from '@command.handler/models/Transaction';

export class TransactionEvent<S extends Account> extends BaseEvent<TransactionEventData, S> {
  static readonly QUEUE_NAME = "transaction";

  constructor() {
    super(TransactionEvent.QUEUE_NAME);
  }

  // TODO: improve transaction event data
  public commit(state: S, event: BaseEvent<TransactionEventData, S>): S {
    if (!event.data) {
      throw new Error('Invalid event data')
    }

    switch (event.data.type) {
      case TransactionType.deposit:
        state.balance = String(Number(state.balance) + Number(event.data.amount))
        break;
      case TransactionType.withdrawal:
        state.balance = String(Number(state.balance) - Number(event.data.amount))
        break;
      default:
        throw new Error('Invalid transaction type')
    }

    return state
  }

  public prepareMessage(message: TransactionEventData): void {
    this.data = new TransactionEventData(
      message.type, 
      message.accountId,
      message.amount, 
      message.currency, 
      message.wallet, 
    );
  }
}

export class TransactionEventData {
  constructor(
    public type: TransactionType,
    public accountId: number,
    public amount: number, 
    public currency: string, 
    public wallet: string,
  ) {}
}