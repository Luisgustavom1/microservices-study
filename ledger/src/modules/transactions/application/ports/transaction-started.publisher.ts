import { TransactionEvents } from 'src/modules/transactions/domain/events/events';

export interface TransactionStartedPublisher {
  publish(event: TransactionEvents): Promise<void>;
}
