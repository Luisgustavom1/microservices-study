import { For, Show } from "solid-js";
import { HeaderItem } from "./header.item";
import { ListItem } from "./list.item";
import { Transaction } from "../model";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = (props: TransactionListProps) => {
  return (
    <div class="flex max-h-[75vh] flex-col overflow-hidden rounded-md border border-gray-200 p-4">
      <h2 class="mb-4 text-lg font-semibold">My Transactions</h2>

      <header class="flex justify-between px-2 py-4">
        <HeaderItem>Date</HeaderItem>
        <HeaderItem>Currency</HeaderItem>
        <HeaderItem>Amount</HeaderItem>
        <HeaderItem>Type</HeaderItem>
      </header>

      <div class="flex-1 overflow-y-auto">
        <Show
          when={props.transactions.length > 0}
          fallback={
            <div class="my-4 flex justify-center">
              <p class="text-lg font-semibold text-gray-500">
                No Transactions found
              </p>
            </div>
          }
        >
          <For each={props.transactions}>
            {(item) => <ListItem {...item} />}
          </For>
        </Show>
      </div>
    </div>
  );
};
