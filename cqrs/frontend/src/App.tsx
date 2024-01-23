import { createSignal, type Component } from 'solid-js';
import { Transaction, TransactionType, Transactions } from './features/transactions';
import { AddTransaction } from './features/transactions/add.transaction';

const App: Component = () => {
  const [transactions, setTransactions] = createSignal<Array<Transaction>>([
    {
      _id: '1',
      transactionId: 1,
      type: TransactionType.deposit,
      wallet: '42342343242',
      currency: 'USD',
      amount: '100',
      created_at: 0,
    },
    {
      _id: '2',
      transactionId: 2,
      type: TransactionType.withdrawal,
      wallet: '42342343242',
      currency: 'R$',
      amount: '200',
      created_at: 0,
    }
  ]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((t) => [...t, transaction]);
  }

  return (
    <>
      <Transactions 
        transactions={transactions()} 
      />
      <AddTransaction addTransaction={addTransaction} />
    </>
  );
};

export default App;
