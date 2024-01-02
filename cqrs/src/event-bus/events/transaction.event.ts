import amqplib from 'amqplib';
import { BaseEvent } from "./base.event";
import { Query } from '../../services/Query';

export class TransactionEvent extends BaseEvent {
  constructor() {
    super("transaction.replicate");
  }

  public async publish(
    message: unknown,
    options?: amqplib.Options.Publish
  ): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);
    const buff = Buffer.from(JSON.stringify(message));
    
    ch.sendToQueue(this.queue, buff, options);
  }

  public async subscribe(queryService: Query): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);

    ch.consume(this.queue, (msg) => {
      if (msg !== null) {
        queryService.save(JSON.parse(msg.content.toString()));
        ch.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }
}