#!/bin/bash
echo "Inicializando filas SQS no LocalStack..."
awslocal sqs create-queue --queue-name agentic-gateway-dlq
awslocal sqs create-queue --queue-name agentic-gateway-queue --attributes '{"RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:agentic-gateway-dlq\",\"maxReceiveCount\":\"3\"}"}'
echo "Filas criadas com sucesso!"
