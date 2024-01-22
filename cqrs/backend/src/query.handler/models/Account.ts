export class Account {
  constructor(
    public accountId: number,
    public wallet: string,
    public balance: string,
    public opened_at: string,
    public updated_at: string,
  ) {}
}
