import { BaseEvent } from "./base.event";
import { TransactionType } from '@command.handler/models/Transaction';

export interface QueryReplicateEventData {
  transaction: TransactionReplicateEventData
  account: AccountReplicateEventData
}
  

export class TransactionReplicateEvent extends BaseEvent<QueryReplicateEventData> {
  static readonly QUEUE_NAME = "transaction.replicate";

  constructor() {
    super(TransactionReplicateEvent.QUEUE_NAME);
  }

  public prepareMessage({ transaction, account }: { transaction: TransactionReplicateEventData, account: AccountReplicateEventData }) {
    this.data = {
      transaction: new TransactionReplicateEventData(
        transaction.type, 
        transaction.transactionId, 
        transaction.currency, 
        transaction.amount, 
        transaction.wallet, 
        transaction.created_at
      ),
      account: new AccountReplicateEventData(
        account.accountId,
        account.wallet,
        account.balance,
        account.opened_at,
        account.updated_at,
      ),
    };
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

export class AccountReplicateEventData {
  constructor(
    public accountId: number,
    public wallet: string,
    public balance: string,
    public opened_at: string,
    public updated_at: string,
  ) {}
}

