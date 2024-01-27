export async function getTransactions(wallet?: string) {
  if (!wallet) return [];
  const response = await fetch(`http://0.0.0.0:8080/transaction/${wallet}`);
  const results = await response.json();
  return results.data;
}

interface TransactionParams {
  amount: number;
  currency: string;
  wallet: string;
}

export type NewTransactionResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function deposit(
  data: TransactionParams,
): Promise<NewTransactionResponse> {
  const response = await fetch(`http://0.0.0.0:8080/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      currency: data.currency,
      wallet: data.wallet,
    }),
  });
  return response.json();
}

export async function withdrawal(
  data: TransactionParams,
): Promise<NewTransactionResponse> {
  const response = await fetch(`http://0.0.0.0:8080/withdrawal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: data.amount,
      currency: data.currency,
      wallet: data.wallet,
    }),
  });
  return response.json();
}
