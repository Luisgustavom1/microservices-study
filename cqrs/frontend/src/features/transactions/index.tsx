import { createResource, createSignal } from "solid-js";
import { TransactionList } from "./List/list";
import { getTransactions } from "../../services/transaction";
import { ImSearch } from "solid-icons/im";
import { Header } from "../../components/header";

export const Transactions = () => {
  const [wallet, setWallet] = createSignal<string>();
  const [transactions] = createResource(
    () => [wallet()] as const,
    ([acc]) => getTransactions(acc),
  );

  const handleSubmit = (ev: Event) => {
    ev.preventDefault();
    const formData = new FormData(ev.target as HTMLFormElement);
    setWallet(formData.get("wallet") as string);
  };

  return (
    <div class="w-full">
      <Header title="Transactions" />

      <main class="p-6">
        <form
          class="mb-4 flex h-fit items-center gap-1"
          onSubmit={handleSubmit}
        >
          <input
            name="wallet"
            placeholder="Search by wallet"
            class="rounded-md border border-gray-200 p-2"
            onChange={(ev) => {
              setWallet(ev.currentTarget.value);
            }}
          />
          <button class="rounded-full p-2 hover:bg-gray-200 hover:transition-all">
            <ImSearch size={18} class="text-gray-500" />
          </button>
        </form>

        <TransactionList transactions={transactions() ?? []} />
      </main>
    </div>
  );
};
