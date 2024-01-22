import { EventBusConnection } from "@event-bus/connection";
import { TransactionReplicateEvent } from "@shared/event-bus/events/query.replicate.event";
import { connectToReadDB } from "./db";
import { QueryListener } from "./query.listener";
import { TransactionQuery } from "./repository/transaction.query";
import { AccountQuery } from "./repository/account.query";

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    hostname: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new TransactionReplicateEvent()
  const listener = new QueryListener(
    new TransactionQuery(),
    new AccountQuery(),
  );

  eventToListen.subscribe(listener)
}
init();