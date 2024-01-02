import amqplib from 'amqplib';
import { BaseEvent } from "./base.event";

export class CommandEvent extends BaseEvent {
  constructor(conn: amqplib.Connection) {
    super(conn, "command.replicate");
  }

  public async publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void> {
    const ch = await this._conn.createChannel();
    await ch.assertQueue(this.queue);
    const buff = Buffer.from(JSON.stringify(message));
    
    ch.sendToQueue(this.queue, buff, options);
  }

  public async subscribe(): Promise<void> {
    const ch = await this._conn.createChannel();
    await ch.assertQueue(this.queue);

    ch.consume(this.queue, (msg) => {
      if (msg !== null) {
        console.log('Received:', msg.content.toString());
        ch.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }
}