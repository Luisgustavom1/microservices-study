import { createResource } from "solid-js";
import { TransactionList } from "./List/list";
import { getTransactions } from "../../services/transaction";
import { Header } from "../../components/header";
import { useWalletContext } from "../../contexts/wallet.context";

export const Transactions = () => {
  const { state } = useWalletContext();
  const [transactions] = createResource(
    () => [state.wallet] as const,
    ([wallet]) => getTransactions(wallet),
  );

  return (
    <div class="w-full">
      <Header title="Transactions" />

      <main class="p-6">
        <TransactionList transactions={transactions() ?? []} />
      </main>
    </div>
  );
};
