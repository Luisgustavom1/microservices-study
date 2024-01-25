import clsx from "clsx";
import { Transaction, TransactionType } from "../model";

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("pt-BR");
}

function formatAmount(amount: string) {
  return Number(amount).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const transactionTypeMapToLabel = {
  [TransactionType.deposit]: "Deposit",
  [TransactionType.withdrawal]: "Withdrawal",
  [TransactionType.transfer]: "Transfer",
};

export const ListItem = (item: Transaction) => {
  return (
    <section class="flex justify-between border-t border-gray-200 px-2 py-4 hover:bg-gray-200 hover:bg-opacity-25 hover:transition-all">
      <div class="w-1/4">{formatDate(item.created_at)}</div>
      <strong class="w-1/4">{item.currency}</strong>
      <p class="w-1/4">{formatAmount(item.amount)}</p>
      <p
        class={clsx(
          "w-1/4",
          item.type === TransactionType.deposit && "text-green-500",
          item.type === TransactionType.withdrawal && "text-red-500",
          item.type === TransactionType.transfer && "text-yellow-500",
        )}
      >
        {transactionTypeMapToLabel[item.type]}{" "}
      </p>
    </section>
  );
};
