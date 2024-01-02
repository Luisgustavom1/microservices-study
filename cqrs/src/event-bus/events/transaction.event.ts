import amqplib from 'amqplib';
import { BaseEvent } from "./base.event";
import { Listener } from '../../listeners/listener';
import { TransactionType } from '../../db-read/collections/transaction';

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

  public prepareMessage(message: TransactionEventDTO): TransactionEventDTO {
    return new TransactionEventDTO(
      message.type, 
      message.transactionId, 
      message.currency, 
      message.amount, 
      message.wallet, 
      message.created_at
    );
  }
}

export class TransactionEventDTO {
  constructor(
    public type: TransactionType, 
    public transactionId: number,
    public currency: string, 
    public amount: string, 
    public wallet: string,
    public created_at: number, 
  ) {}
}