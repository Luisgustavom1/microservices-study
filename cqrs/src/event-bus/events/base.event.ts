import amqplib from 'amqplib';
import { EventBusConnection } from '../connection';
import { Listener } from '../../listeners/listener';

export abstract class BaseEvent<T = unknown> {
  constructor(
    protected queue: string,
  ) {}

  public abstract publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void>;

  public abstract subscribe(queryService: Listener): Promise<void>;

  protected connection() {
    return EventBusConnection.connection;
  }

  public abstract prepareMessage(message: T): unknown;
}