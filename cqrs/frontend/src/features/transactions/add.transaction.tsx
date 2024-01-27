import { For, JSX } from "solid-js";
import { Header } from "../../components/header";
import { TransactionType } from "./model";
import { transactionTypeMapToLabel } from "./utils";
import toast from "solid-toast";
import { deposit, withdrawal } from "../../services/transaction";
import { useWalletContext } from "../../contexts/wallet.context";

export const AddTransaction = () => {
  const { state } = useWalletContext();

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event> = async (
    ev,
  ) => {
    ev.preventDefault();

    const formData = new FormData(ev.currentTarget);
    const amount = formData.get("amount")?.toString();
    const currency = formData.get("currency")?.toString();
    const type = formData.get("type")?.toString();

    if (!amount || !currency || !state.wallet || !type) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      amount: Number(amount),
      currency,
      wallet: state.wallet,
    };

    let result;
    switch (type) {
      case TransactionType.deposit:
        result = await deposit(payload);
        break;
      case TransactionType.withdrawal:
        result = await withdrawal(payload);
        break;
      case TransactionType.transfer:
        console.log("transfer", amount, currency, state.wallet);
      default:
        toast.error("Invalid transaction type");
        break;
    }

    if (result?.success) {
      toast.success(
        "Transaction created, in a few moments the transaction will be completed",
      );
      ev.currentTarget.reset();
    } else {
      toast.error(result?.error ?? "Error creating transaction");
    }
  };

  return (
    <div class="w-full">
      <Header title="Add transaction" />

      <main class="p-6">
        <div class="flex max-h-[75vh] flex-col overflow-hidden rounded-md border border-gray-200 p-4">
          <h2 class="mb-4 text-lg font-semibold">New Transaction</h2>

          <form class="grid gap-8" onSubmit={handleSubmit}>
            <section class="grid grid-cols-2 gap-4">
              <label>
                <p class="mb-1 font-semibold text-gray-600">Amount</p>
                <input
                  class="w-full rounded-md border border-gray-200 p-2"
                  name="amount"
                  placeholder="Ex: 1400.12"
                />
              </label>

              <label>
                <p class="mb-1 font-semibold text-gray-600">Currency</p>
                <input
                  class="w-full rounded-md border border-gray-200 p-2"
                  name="currency"
                  placeholder="Ex: R$"
                />
              </label>

              <label class="col-span-1">
                <p class="mb-1 font-semibold text-gray-600">Transaction Type</p>
                <select
                  name="type"
                  class="w-full rounded-md border border-gray-200 p-2"
                >
                  <For each={Object.values(TransactionType)}>
                    {(item) => (
                      <option value={item}>
                        {transactionTypeMapToLabel[item]}
                      </option>
                    )}
                  </For>
                </select>
              </label>
            </section>

            <button
              type="submit"
              class="ml-auto w-full rounded-md border border-gray-400 p-3 font-semibold text-gray-400 hover:bg-gray-400 hover:bg-opacity-50 hover:text-gray-50 hover:transition-all"
            >
              Create
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
