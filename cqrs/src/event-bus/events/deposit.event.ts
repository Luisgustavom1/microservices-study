import amqplib from 'amqplib';
import { BaseEvent } from "./base.event";
import { Listener } from '../../listeners/listener';
import { TransactionType } from '../../db-read/collections/transaction';

export class DepositEvent extends BaseEvent {
  constructor() {
    super("deposit");
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

  public async subscribe(listeners: Listener): Promise<void> {
    const ch = await this.connection().createChannel();
    await ch.assertQueue(this.queue);

    ch.consume(this.queue, (msg) => {
      if (msg !== null) {
        listeners.execute(JSON.parse(msg.content.toString()));
        ch.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }

  public prepareMessage(message: Omit<DepositEventDTO, "type" | "created_at">): DepositEventDTO {
    return new DepositEventDTO(
      TransactionType.deposit, 
      message.accountId,
      message.amount, 
      message.currency, 
      message.wallet, 
    );
  }
}
export class DepositEventDTO {
  constructor(
    public type: TransactionType.deposit,
    public accountId: number,
    public amount: number, 
    public currency: string, 
    public wallet: string,
  ) {}
}