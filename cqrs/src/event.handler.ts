import { connectToReadDB } from "./db-read";
import { EventBusConnection } from "./event-bus/connection";
import { TransactionEvent } from "./event-bus/events/transaction.event";
import { TransactionQuery } from "./services/Transaction/Query";

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    host: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const commandEvent = new TransactionEvent();
  commandEvent.subscribe(new TransactionQuery())
}
init();