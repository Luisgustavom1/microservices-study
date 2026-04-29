export interface StartTransactionRequest {
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  idempotencyKey: string;
}
