export interface TransactionStartedDomainEvent {
  eventName: 'transaction-started';
  transactionId: string;
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  status: string;
  occurredAt: string;
}

export const TRANSACTION_STARTED_PUBLISHER = Symbol(
  'TRANSACTION_STARTED_PUBLISHER',
);
