import { createResource, createSignal } from "solid-js";
import { getAccount } from "../../services/account";
import { useWalletContext } from "../../contexts/wallet.context";

function formatBalance(balance: number) {
  return balance.toFixed(2);
}

export const AccountSection = () => {
  const { state } = useWalletContext();
  const [account] = createResource<Account>(() => getAccount(state.wallet));

  return (
    <section class="sticky top-full grid gap-2 px-6 py-4">
      <p class="flex items-end gap-1 text-sm font-semibold">
        Wallet:
        <strong class="text-base leading-5 text-gray-600">
          {state.wallet}
        </strong>
      </p>

      <p class="flex items-end gap-1 text-sm font-semibold">
        Balance:
        <strong class="text-base leading-5 text-gray-600">
          {formatBalance(Number(account()?.balance || 0))}
        </strong>
      </p>
    </section>
  );
};
