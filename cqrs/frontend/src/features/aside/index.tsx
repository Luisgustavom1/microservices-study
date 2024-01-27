import { FaRegularMoneyBill1, FaSolidList } from "solid-icons/fa";
import { VsDiffAdded } from "solid-icons/vs";
import { Item } from "./item";
import { AccountSection } from "./account.section";
import { FiLogOut } from "solid-icons/fi";
import { useWalletContext } from "../../contexts/wallet.context";

export const Aside = () => {
  const { signOut } = useWalletContext();

  return (
    <aside class="relative h-screen min-w-60 border-r border-r-gray-200 bg-gray-light">
      <header class="mb-4 flex items-center gap-2 p-6">
        <FaRegularMoneyBill1 size={20} />
        <h2 class="font-bold">Bank Dashboard</h2>
      </header>

      <ul class="grid gap-1 px-4">
        <Item
          Icon={<FaSolidList size={20} />}
          text="All transactions"
          href="/transactions"
        />
        <Item
          Icon={<VsDiffAdded size={20} />}
          text="Add transaction"
          href="/transactions/add"
        />
        <Item
          Icon={<FiLogOut size={20} />}
          text="Sign out"
          href="/"
          cb={signOut}
        />
      </ul>

      <AccountSection />
    </aside>
  );
};
