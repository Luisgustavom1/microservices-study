import { TransactionType } from "./model";

export const transactionTypeMapToLabel = {
  [TransactionType.deposit]: "Deposit",
  [TransactionType.withdrawal]: "Withdrawal",
  [TransactionType.transfer]: "Transfer",
};
