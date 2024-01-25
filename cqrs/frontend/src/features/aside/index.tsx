import { FaRegularMoneyBill1, FaSolidList } from "solid-icons/fa";
import { FiArrowDownCircle, FiArrowUpCircle } from "solid-icons/fi";
import { Item } from "./item";

export const Aside = () => {
  return (
    <aside class="h-screen min-w-60 border-r border-r-gray-200 bg-gray-light">
      <header class="mb-4 flex items-center gap-2 p-6">
        <FaRegularMoneyBill1 size={20} />
        <h2 class="font-bold">Bank Dashboard</h2>
      </header>

      <ul class="grid gap-1 px-4">
        <Item
          Icon={<FaSolidList size={20} />}
          text="All transactions"
          href="/"
        />
        <Item
          Icon={<FiArrowDownCircle size={20} />}
          text="Deposit"
          href="/deposit"
        />
        <Item
          Icon={<FiArrowUpCircle size={20} />}
          text="Withdrawals"
          href="/withdrawals"
        />
      </ul>
    </aside>
  );
};
