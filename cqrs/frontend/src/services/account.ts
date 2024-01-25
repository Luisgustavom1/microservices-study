export async function getAccount(wallet = 987654321987) {
  if (!wallet) return [];
  const response = await fetch(`http://0.0.0.0:8080/account/${wallet}`);
  const results = await response.json();
  return results.data;
}
