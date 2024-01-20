import { EventBusConnection } from "@event-bus/connection";
import { TransactionEvent } from "@event-bus/events/transaction.event";
import { TransactionReplicateEvent } from "@event-bus/events/transaction.replicate.event";
import { CommandListener } from "./command.listener";
import { TransactionCommand } from "./repository/transaction.command";
import { Reducer } from "@shared/reducer";
import { AccountCommand } from "./repository/account.command";

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
    new TransactionReplicateEvent(),
    new AccountCommand(),
    new Reducer()
  );

  eventToListen.subscribe(listener)
}
init();