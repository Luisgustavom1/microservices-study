import { Transaction } from "./Transaction";

export class Account {
  constructor(
    public id: number,
    public type: AccountType,
    public wallet: string,
    public balance: string,
    public opened_at: Date,
    public updated_at: Date,
    public transactions?: Array<Omit<Transaction, "accountId">>, // events from event sourcing
  ) {}
}

export enum AccountType {
  checking = 'checking',
  savings = 'savings',
  investment = 'investment',
} 