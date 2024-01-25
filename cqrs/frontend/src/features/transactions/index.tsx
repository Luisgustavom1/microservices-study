import { createResource, createSignal } from "solid-js";
import { TransactionList } from "./List/list";
import { getTransactions } from "../../services/transaction";

interface TransactionsProps {
  title: string;
}

export const Transactions = (props: TransactionsProps) => {
  const [wallet, setWallet] = createSignal<string>();
  const [transactions] = createResource(
    () => [wallet()] as const,
    ([acc]) => getTransactions(acc),
  );

  return (
    <div class="w-full">
      <header class="mb-4 flex w-full items-center gap-2 border-b border-b-gray-200 bg-gray-light p-6">
        <h1 class="font-bold">{props.title}</h1>
      </header>

      <main class="p-6">
        <input
          placeholder="Search by wallet"
          class="mb-4 rounded-md border border-gray-200 p-2"
          onChange={(ev) => {
            setWallet(ev.currentTarget.value);
          }}
        />
        <TransactionList transactions={transactions() ?? []} />
      </main>
    </div>
  );
};
