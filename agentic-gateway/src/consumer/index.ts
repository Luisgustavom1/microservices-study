import { startOutboxRelay } from "./outbox-relay";
import { startSQSConsumer } from "./agentic-queue-consumer";

console.log("Iniciando container de background workers...");

startOutboxRelay();

startSQSConsumer();
