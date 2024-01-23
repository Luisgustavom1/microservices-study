import { Transaction, TransactionType } from ".";

interface AddTransactionProps {
  addTransaction: (transaction: Transaction) => void;
}

export const AddTransaction = ({ addTransaction }: AddTransactionProps) => {
  return (
    <button onClick={() => {
      const randTransaction: Transaction = {
        _id: Math.random().toString(),
        transactionId: Math.random(),
        type: Math.random() > 0.5 ? TransactionType.deposit : TransactionType.withdrawal,
        wallet: Math.random().toString(),
        currency: Math.random().toString(),
        amount: Math.random().toString(),
        created_at: Math.random(),
      }

      addTransaction(randTransaction)
    }}>
      add transaction
    </button>
  )
}