import { SQSClient } from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

// No LocalStack, a URL padrão segue esse formato com a conta 000000000000
export const QUEUE_URL = `${process.env.AWS_ENDPOINT || "http://localhost:4566"}/000000000000/agentic-gateway-queue`;
