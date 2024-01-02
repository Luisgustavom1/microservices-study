import { connectToReadDB } from "./db-read";
import { EventBusConnection } from "./event-bus/connection";
import { TransactionReplicateEvent } from "./event-bus/events/transaction.replicate.event";
import { QueryListener } from "./listeners/transaction/query.listener";
import { TransactionQuery } from "./services/transaction/query";

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    host: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new TransactionReplicateEvent()
  const queryService = new TransactionQuery();
  const listener = new QueryListener(queryService);

  eventToListen.subscribe(listener)
}
init();