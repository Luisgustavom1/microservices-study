interface ListAccounts {
  id: string;
  type: string;
  wallet: string;
}

interface Account {
  _id: string;
  wallet: string;
  accountId: number;
  balance: string;
  opened_at: string;
  updated_at: string;
}
