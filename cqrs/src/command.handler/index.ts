import { EventBusConnection } from "@event-bus/connection";
import { DepositEvent } from "@event-bus/events/deposit.event";
import { TransactionReplicateEvent } from "@event-bus/events/transaction.replicate.event";
import { CommandListener } from "./command.listener";
import { TransactionCommand } from "./services/command";

async function init() {
  await EventBusConnection.connect({
    host: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  const eventToListen = new DepositEvent()
  const eventBus = new TransactionReplicateEvent();
  const commandService = new TransactionCommand();
  const listener = new CommandListener(commandService, eventBus);

  eventToListen.subscribe(listener)
}
init();