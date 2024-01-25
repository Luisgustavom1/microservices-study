export async function getTransactions(wallet?: string) {
  if (!wallet) return [];
  const response = await fetch(`http://0.0.0.0:8080/transaction/${wallet}`);
  const results = await response.json();
  return results.data;
}
