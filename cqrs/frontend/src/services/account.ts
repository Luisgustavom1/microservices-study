export async function getAccount(wallet?: string) {
  if (!wallet) return;
  const response = await fetch(`http://0.0.0.0:8080/account/${wallet}`);
  const results = await response.json();
  return results.data;
}

export async function list() {
  const response = await fetch(`http://0.0.0.0:8080/account`);
  const results = await response.json();
  return results.data;
}
