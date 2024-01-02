import { BaseEvent } from "./base.event";
import { TransactionType } from '../../db-read/collections/transaction';

export class DepositEvent extends BaseEvent {
  constructor() {
    super("deposit");
  }

  public prepareMessage(message: Omit<DepositEventDTO, "type" | "created_at">): DepositEventDTO {
    return new DepositEventDTO(
      TransactionType.deposit, 
      message.accountId,
      message.amount, 
      message.currency, 
      message.wallet, 
    );
  }
}
export class DepositEventDTO {
  constructor(
    public type: TransactionType.deposit,
    public accountId: number,
    public amount: number, 
    public currency: string, 
    public wallet: string,
  ) {}
}