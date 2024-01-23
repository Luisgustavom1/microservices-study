import { For } from "solid-js";

export interface Transaction {
  transactionId: number;
  type: TransactionType;
  wallet: string;
  currency: string;
  amount: string;
  created_at: number;
  _id: string;
}

export enum TransactionType {
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  transfer = 'transfer',
}

interface TransactionsProps {
  transactions: Transaction[];
}

export const Transactions = (props: TransactionsProps) => {
  return (
    <ul>
      <For each={props.transactions}>
        {(transaction) => (
          <li>
            {transaction.type} {transaction.amount} {transaction.currency} from {transaction.wallet}
          </li>
        )}
      </For>
    </ul>
  )
}