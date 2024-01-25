import { createSignal } from "solid-js";
import { TransactionList } from "./List/list";
import { Transaction, TransactionType } from "./model";

interface TransactionsProps {
  title: string;
}

export const Transactions = (props: TransactionsProps) => {
  const [transactions, setTransactions] = createSignal<Array<Transaction>>([
    {
      _id: "1",
      transactionId: 1,
      type: TransactionType.deposit,
      wallet: "42342343242",
      currency: "USD",
      amount: "100",
      created_at: new Date().getTime(),
    },
    {
      _id: "2",
      transactionId: 2,
      type: TransactionType.withdrawal,
      wallet: "42342343242",
      currency: "R$",
      amount: "200",
      created_at: new Date().getTime(),
    },
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((t) => [...t, transaction]);
  };

  return (
    <div class="w-full">
      <header class="mb-4 flex w-full items-center gap-2 border-b border-b-gray-200 bg-gray-light p-6">
        <h1 class="font-bold">{props.title}</h1>
      </header>

      <main class="p-6">
        <TransactionList transactions={transactions()} />
      </main>
    </div>
  );
};
