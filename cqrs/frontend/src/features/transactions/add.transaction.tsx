import { Header } from "../../components/header";

export const AddTransaction = () => {
  return (
    <div class="w-full">
      <Header title="Add transaction" />

      <main class="p-6">
        <form class="flex max-h-[75vh] flex-col overflow-hidden rounded-md border border-gray-200 p-4">
          <h2 class="mb-4 text-lg font-semibold">New Transaction</h2>
        </form>
      </main>
    </div>
  );
};
