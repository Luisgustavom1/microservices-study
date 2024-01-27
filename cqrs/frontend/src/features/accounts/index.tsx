import { For, JSX, Show, createResource } from "solid-js";
import * as account from "../../services/account";
import { useWalletContext } from "../../contexts/wallet.context";

export const Accounts = () => {
  const [accounts] = createResource<ListAccounts[]>(account.list);
  const { setWallet } = useWalletContext();

  const handleSelectWallet = (wallet: string) => {
    setWallet(wallet);
  };

  return (
    <div class=" flex w-screen flex-col items-center p-32">
      <h1 class="text-2xl font-semibold text-gray-500">Select your account</h1>

      <main class="mt-8 w-full max-w-2xl">
        <Show when={!accounts.loading} fallback={<p>Loading...</p>}>
          <div class="grid w-full gap-4">
            <For each={accounts()} fallback={<p>No accounts found.</p>}>
              {(account) => (
                <a
                  class="w-full cursor-pointer rounded-md bg-gray-100 p-4 text-center shadow-md hover:bg-opacity-50 hover:transition-all"
                  href="/transactions"
                  onClick={() => handleSelectWallet(account.wallet)}
                >
                  <p class="text-sm text-gray-500">
                    Wallet:{" "}
                    <strong class="text-base font-bold">
                      {account.wallet}
                    </strong>
                  </p>
                </a>
              )}
            </For>
          </div>
        </Show>
      </main>
    </div>
  );
};
