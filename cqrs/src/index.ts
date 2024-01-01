import fastify from 'fastify'
import { DepositController, DepositInputDTO } from "./controllers/deposit";

const server = fastify()

server.post<{ Body: DepositInputDTO }>('/deposit', async (request) => {
  return DepositController.deposit(request);
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})