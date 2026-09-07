import { sqsClient, AGENTIC_GATEWAY_QUEUE_URL } from "../aws/sqs";
import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { AgentService } from "./agent";
import { db } from "../db";

const agent = new AgentService();

export async function processSQSQueue() {
  try {
    const { Messages } = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: AGENTIC_GATEWAY_QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 5, // Long polling
      })
    );

    if (!Messages || Messages.length === 0) {
      console.log(`[AI Consumer] Nenhuma mensagem encontrada na fila.`);
      return;
    }

    for (const msg of Messages) {
      if (!msg.Body) continue;

      const payload = JSON.parse(msg.Body);
      console.log(`[AI Consumer] Mensagem lida da fila. ID do Banco: ${payload.id}`);

      const resultAffected = await db("messages").where({
        id: payload.id,
        status: "RECEIVED",
      }).update({ status: "PROCESSING" });

      if (resultAffected === 0) {
        console.log(`[AI Consumer] Mensagem ${payload.id} já está sendo processada ou não está no status RECEIVED. Ignorando.`);
        continue;
      }

      const agentResult = await agent.processMessage(payload.external_id, payload.customer_identifier, payload.content);
      // TODO: dispatch webhook to chatwoot

      await db("messages").where("id", payload.id).update({ status: agentResult.status });

      console.log(`[AI Consumer] Fluxo finalizado: ${agentResult.status}. Resposta: ${agentResult.replyMessage}`);

      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: AGENTIC_GATEWAY_QUEUE_URL,
          ReceiptHandle: msg.ReceiptHandle,
        })
      );
      console.log(`[AI Consumer] Mensagem removida da fila do SQS.`);
    }
  } catch (error) {
    console.error("[AI Consumer] Erro ao consumir fila retry:", error);
  }
}

export function startSQSConsumer(intervalMs = 2000) {
  console.log(`🚀 AI Consumer iniciado. Escutando a fila...`);
  setInterval(processSQSQueue, intervalMs);
}
