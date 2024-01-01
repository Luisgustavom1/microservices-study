import fastify from 'fastify'
import { DepositController, DepositDTO } from "./controllers/deposit";

const server = fastify()

server.post<{ Body: DepositDTO }>('/deposit', async (request, reply) => {
  return DepositController.deposit(request, reply);
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})