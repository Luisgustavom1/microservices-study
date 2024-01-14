import { EventBusConnection } from "@event-bus/connection";
import { TransactionEvent } from "@event-bus/events/transaction.event";
import { TransactionReplicateEvent } from "@event-bus/events/transaction.replicate.event";
import { CommandListener } from "./command.listener";
import { TransactionCommand } from "./repository/command";

async function init() {
  await EventBusConnection.connect({
    hostname: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new TransactionEvent()
  const listener = new CommandListener(
    new TransactionCommand(), 
    new TransactionReplicateEvent()
  );

  eventToListen.subscribe(listener)
}
init();