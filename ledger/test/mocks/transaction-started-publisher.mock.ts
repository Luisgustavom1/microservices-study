import { TransactionStartedPublisher } from '../../src/modules/transactions/application/ports/transaction-started.publisher';
import { TransactionEvents } from '../../src/modules/transactions/domain/events/events';

export interface TransactionStartedEventExpectationInput {
  originWalletId: string;
  destinationWalletId: string;
  amount: string;
  status: string;
}

export interface TransactionStartedPublisherMock {
  publisher: TransactionStartedPublisher;
  publishMock: jest.Mock<Promise<void>, [TransactionEvents]>;
}

export function createTransactionStartedPublisherMock(): TransactionStartedPublisherMock {
  const publishMock = jest.fn<Promise<void>, [TransactionEvents]>();
  publishMock.mockResolvedValue(undefined);

  return {
    publisher: {
      publish: publishMock,
    },
    publishMock,
  };
}

export function expectedTransactionStartedEvent(
  input: TransactionStartedEventExpectationInput,
): TransactionEvents {
  return {
    eventName: 'transaction-started',
    transactionId: expect.any(String),
    originWalletId: input.originWalletId,
    destinationWalletId: input.destinationWalletId,
    amount: input.amount,
    status: input.status,
    occurredAt: expect.any(String),
  };
}
