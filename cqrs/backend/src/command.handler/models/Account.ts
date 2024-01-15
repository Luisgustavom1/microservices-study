import { Transaction } from "./Transaction";

export class Account {
  constructor(
    public id: number,
    public type: AccountType,
    public wallet: string,
    public balance: string,
    public opened_at: string,
    public updated_at: string,
    public transactions: Array<Transaction>, // events from event sourcing
  ) {}
}

enum AccountType {
  checking = 'checking',
  savings = 'savings',
  investment = 'investment',
} 