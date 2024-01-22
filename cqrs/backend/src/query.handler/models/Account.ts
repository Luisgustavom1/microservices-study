export class Account {
  constructor(
    public id: number,
    public wallet: string,
    public balance: string,
    public opened_at: Date,
    public updated_at: Date,
  ) {}
}
