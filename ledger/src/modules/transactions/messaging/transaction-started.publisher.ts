import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Logger } from '@nestjs/common';
import type { TransactionStartedPublisher } from '../application/ports/transaction-started.publisher';
import { TransactionEvents } from '../domain/events/events';

export class SnsTransactionStartedPublisher implements TransactionStartedPublisher {
  private readonly snsClient: SNSClient;
  private readonly logger = new Logger(SnsTransactionStartedPublisher.name);

  constructor(
    private readonly topicArn: string,
    region: string,
  ) {
    this.snsClient = new SNSClient({ region });
  }

  async publish(event: TransactionEvents): Promise<void> {
    const result = await this.snsClient.send(
      new PublishCommand({
        TopicArn: this.topicArn,
        Subject: event.eventName,
        Message: JSON.stringify(event),
        MessageGroupId: event.originWalletId,
        MessageDeduplicationId: event.transactionId,
        MessageAttributes: {
          eventName: {
            DataType: 'String',
            StringValue: event.eventName,
          },
        },
      }),
    );

    console.log('SNS publish result:', result);

    this.logger.log(
      `Published ${event.eventName} event for transactionId=${event.transactionId}`,
    );
  }
}
