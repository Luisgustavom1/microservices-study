import amqplib from 'amqplib';
import { EventBusConnection } from '../connection';
import { Listener } from "@event-bus/Listener";

export abstract class BaseEvent<T = unknown, S = unknown> {
  public data?: T;

  constructor(
    protected queue: string,
  ) {}

  public async publish(
    options?: amqplib.Options.Publish
  ): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);
    const buff = Buffer.from(JSON.stringify(this.data));
    
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

  public commit(state: S, value: BaseEvent<T, S>): S {
    throw new Error('Method not implemented.');
  };
  
  public abstract prepareMessage(message: T): void;
}