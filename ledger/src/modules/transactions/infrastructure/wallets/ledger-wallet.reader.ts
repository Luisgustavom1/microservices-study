export interface WalletSnapshot {
  id: string;
  email: string;
  balance: string;
}

export class LedgerWalletReader {
  constructor(private readonly baseUrl: string) {}

  async getById(walletId: string): Promise<WalletSnapshot | null> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/wallets/${walletId}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`failed to fetch wallet ${walletId}`);
    }

    return (await response.json()) as WalletSnapshot;
  }
}
