import fastify from 'fastify'
import { connectToReadDB } from '@query.handler/db';
import { EventBusConnection } from '@event-bus/connection';
import { initRoutes } from './controllers/routes';

const server = fastify()

initRoutes(server)

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