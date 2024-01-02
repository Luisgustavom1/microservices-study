import amqplib from 'amqplib';
import { EventBusConnection } from '../connection';
import { Listener } from '../../listeners/listener';

export abstract class BaseEvent<T = unknown> {
  constructor(
    protected queue: string,
  ) {}

  public async publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);
    const buff = Buffer.from(JSON.stringify(message));
    
    ch.sendToQueue(this.queue, buff, options);
  }

  public async subscribe(listener: Listener): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);

    ch.consume(this.queue, (msg) => {
      if (msg !== null) {
        listener.execute(JSON.parse(msg.content.toString()));
        ch.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }

  protected connection() {
    return EventBusConnection.connection;
  }

  public abstract prepareMessage(message: T): unknown;
}