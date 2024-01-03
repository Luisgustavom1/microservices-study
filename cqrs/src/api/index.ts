import fastify from 'fastify'
import { TransactionController, DepositDTO } from "./controllers/transaction";
import { connectToReadDB } from '@query.handler/db';
import { EventBusConnection } from '@event-bus/connection';

const server = fastify()

server.post<{ Body: DepositDTO }>('/deposit', async (request, reply) => {
  return TransactionController.deposit(request, reply);
})

server.get<{ Params: { wallet: string } }>('/transaction/:wallet', async (request, reply) => {
  return TransactionController.list(request, reply);
})

async function init() {
  await connectToReadDB();

  await EventBusConnection.connect({
    hostname: process.env.EVENT_BUS_HOST,
    port: Number(process.env.EVENT_BUS_PORT),
    username: process.env.EVENT_BUS_USERNAME,
    password: process.env.EVENT_BUS_PASSWORD,
  })

  server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}
init();