import { connectToReadDB } from "./db-read";
import { EventBusConnection } from "./event-bus/connection";
import { DepositEvent } from "./event-bus/events/deposit.event";
import { TransactionReplicateEvent } from "./event-bus/events/transaction.replicate.event";
import { CommandListener } from "./listeners/transaction/command.listener";
import { TransactionCommand } from "./services/transaction/command";

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    host: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new DepositEvent()
  const newEvent = new TransactionReplicateEvent();
  const commandService = new TransactionCommand();
  const listener = new CommandListener(commandService, newEvent);

  eventToListen.subscribe(listener)
}
init();