import { SQSClient } from "@aws-sdk/client-sqs";

const awsEndpoint = process.env.AWS_ENDPOINT || "http://localhost:4566";

export const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: awsEndpoint,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

export const AGENTIC_GATEWAY_QUEUE_URL =
  process.env.AGENTIC_GATEWAY_QUEUE_URL || `${awsEndpoint}/000000000000/agentic-gateway-queue`;
