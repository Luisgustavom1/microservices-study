import amqplib from 'amqplib';

export abstract class BaseEvent {
  constructor(
    protected _conn: amqplib.Connection,
    protected queue: string,
  ) {}

  public abstract publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void>;

  public abstract subscribe(): Promise<void>;
}