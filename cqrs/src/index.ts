import fastify from 'fastify'
import { TransactionController, DepositDTO } from "./controllers/transaction";

const server = fastify()

server.post<{ Body: DepositDTO }>('/deposit', async (request, reply) => {
  return TransactionController.deposit(request, reply);
})

server.get<{ Params: { wallet: string } }>('/transaction/:wallet', async (request, reply) => {
  return TransactionController.list(request, reply);
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})