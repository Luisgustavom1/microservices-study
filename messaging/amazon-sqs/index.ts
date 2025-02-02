import { DeleteMessageBatchCommand, GetQueueAttributesCommand, GetQueueUrlCommand, ReceiveMessageCommand, SQSClient, SendMessageBatchCommand, paginateListQueues } from "@aws-sdk/client-sqs";
import { fileURLToPath } from "node:url";


const client = new SQSClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const queueUrlCommand = new GetQueueUrlCommand({ QueueName: "news-queue" });
const { QueueUrl } = await client.send(queueUrlCommand);

export const consumer = async () => {
  const queueUrlCommand = new GetQueueAttributesCommand({ QueueUrl, AttributeNames: ["All"] });
  const { Attributes } = await client.send(queueUrlCommand);

  console.log(Attributes);
  
  const { Messages } = await client.send(
    new ReceiveMessageCommand({
      MessageSystemAttributeNames: ["All"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["Title", "Author"],
      QueueUrl,
      WaitTimeSeconds: 20,
      VisibilityTimeout: 20,
    }),
  )

  if (!Messages) {
    return;
  }

  console.log(Messages);
  await client.send(
    new DeleteMessageBatchCommand({
      QueueUrl,
      Entries: Messages.map((message) => ({
        Id: message.MessageId,
        ReceiptHandle: message.ReceiptHandle,
      })),
    }),
  );
};

const producer = async () => {
  const command = new SendMessageBatchCommand({
    QueueUrl,
    Entries: [
      {
        Id: "5",
        DelaySeconds: 1,
        MessageAttributes: {
          Title: {
            DataType: "String",
            StringValue: "The Whistler",
          },
        },
        MessageBody:
          "Information about current NY Times fiction bestseller for week of 12/11/2026.",
      }
    ]
  });

  console.log("sending message...");
  const response = await client.send(command);
  return response;
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  producer().then(() => consumer().then(() => console.log("done")));
}