import { For } from "solid-js";
import { HeaderItem } from "./header.item";
import { ListItem } from "./list.item";
import { Transaction } from "../model";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = (props: TransactionListProps) => {
  return (
    <div class="rounded-md border border-gray-200 p-4">
      <h2 class="mb-4 text-lg font-semibold">Transactions</h2>

      <header class="flex justify-between px-2 py-4">
        <HeaderItem>Date</HeaderItem>
        <HeaderItem>Currency</HeaderItem>
        <HeaderItem>Amount</HeaderItem>
        <HeaderItem>Type</HeaderItem>
      </header>

      <For each={props.transactions}>{(item) => <ListItem {...item} />}</For>
    </div>
  );
};
