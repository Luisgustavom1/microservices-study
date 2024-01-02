import amqplib from 'amqplib';
import { EventBusConnection } from '../connection';
import { Query } from '../../services/Query';

export abstract class BaseEvent {
  constructor(
    protected queue: string,
  ) {}

  public abstract publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void>;

  public abstract subscribe(queryService: Query): Promise<void>;

  protected connection() {
    return EventBusConnection.connection;
  }
}