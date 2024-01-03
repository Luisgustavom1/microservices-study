import { EventBusConnection } from "@event-bus/connection";
import { TransactionReplicateEvent } from "@event-bus/events/transaction.replicate.event";
import { connectToReadDB } from "./db";
import { QueryListener } from "./query.listener";
import { TransactionQuery } from "./services/query";

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    host: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new TransactionReplicateEvent()
  const listener = new QueryListener(new TransactionQuery());

  eventToListen.subscribe(listener)
}
init();