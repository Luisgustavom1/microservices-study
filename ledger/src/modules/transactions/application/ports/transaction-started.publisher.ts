import { TransactionEvents } from '../../domain/events/events';

export interface TransactionStartedPublisher {
  publish(event: TransactionEvents): Promise<void>;
}
