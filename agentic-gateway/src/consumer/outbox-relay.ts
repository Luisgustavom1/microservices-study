import { db } from "../db";
import { sqsClient, AGENTIC_GATEWAY_QUEUE_URL } from "../aws/sqs";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export async function processOutbox() {
  try {
    await db.transaction(async (trx) => {
      const result = await trx.raw(`
        SELECT id, payload 
        FROM outbox_events 
        WHERE status = 'PENDING' 
        ORDER BY created_at ASC 
        LIMIT 10 
        FOR UPDATE SKIP LOCKED
      `);

      const events = result.rows;

      if (events.length === 0) {
        return;
      }

      console.log(`[Outbox Relay] Encontrou ${events.length} eventos para enviar.`);

      const publishedIds: string[] = [];
      for (const event of events) {
        try {
          // TODO: make a strategy to send the message to the correct queue based on the event type
          await sqsClient.send(
            new SendMessageCommand({
              QueueUrl: AGENTIC_GATEWAY_QUEUE_URL,
              MessageBody: JSON.stringify(event.payload),
              // TODO: passar a enviar MessageGroupId: "group-1",
            })
          );
          publishedIds.push(event.id);
        } catch (sqsError) {
          console.error(`[Outbox Relay] Falha ao enviar evento ${event.id} para SQS:`, sqsError);
        }
      }

      if (publishedIds.length > 0) {
        await trx("outbox_events")
          .whereIn("id", publishedIds)
          .update({
            status: "PUBLISHED",
            processed_at: db.fn.now(),
          });
        console.log(`[Outbox Relay] ${publishedIds.length} eventos marcados como PUBLISHED.`);
      }
    });
  } catch (error) {
    console.error("[Outbox Relay] Erro crítico no ciclo de processamento:", error);
  }
}

export function startOutboxRelay(intervalMs = 2000) {
  console.log(`🚀 Outbox Relay iniciado. Pooling a cada ${intervalMs}ms...`);
  setInterval(processOutbox, intervalMs);
}
