import { FastifyInstance } from "fastify";
import { TransactionController, TransactionDTO } from "./transaction";

export const initRoutes = (server: FastifyInstance) => {
  server.post<{ Body: TransactionDTO }>('/deposit', async (request, reply) => {
    return TransactionController.deposit(request, reply);
  })

  server.post<{ Body: TransactionDTO }>('/withdrawal', async (request, reply) => {
    return TransactionController.withdrawal(request, reply);
  })
  
  server.get<{ Params: { wallet: string } }>('/transaction/:wallet', async (request, reply) => {
    return TransactionController.list(request, reply);
  })
}
