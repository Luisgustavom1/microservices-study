import { FastifyInstance } from "fastify";
import { TransactionController, TransactionDTO } from "./transaction";
import { AccountController } from "./account";

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

  server.get('/account', async (request, reply) => {
    return AccountController.list(request, reply);
  })

  server.get<{ Params: { wallet: string } }>('/account/:wallet', async (request, reply) => {
    return AccountController.getByWallet(request, reply);
  })
}
