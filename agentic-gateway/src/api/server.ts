import express from "express";
import { z } from "zod";
import { db } from "../db";

const app = express();
app.use(express.json());

const WebhookSchema = z.object({
  message_id: z.string(),
  from: z.string(),
  body: z.string(),
});

app.post("/webhook/whatsapp", async (req, res) => {
  const result = WebhookSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const { message_id, from, body } = result.data;

  // TODO: add idempotency check before insert
  try {
    await db.transaction(async (trx) => {
      const [message] = await trx("messages")
        .insert({
          external_id: message_id,
          customer_identifier: from,
          content: body,
          status: "RECEIVED",
        })
        .returning("*");

      await trx("outbox_events").insert({
        aggregate_type: "Message",
        aggregate_id: message.id,
        event_type: "MessageReceived",
        payload: JSON.stringify(message),
        status: "PENDING",
      });
    });

    console.log(`[API] Mensagem recebida com sucesso: ${message_id}`);
    return res.status(200).send("OK");

  } catch (error: any) {
    if (error.code === "23505") {
      console.log(`[API] Mensagem duplicada ignorada (Idempotência): ${message_id}`);
      return res.status(200).send("OK");
    }

    console.error(`[API] Erro ao processar webhook:`, error);
    return res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
