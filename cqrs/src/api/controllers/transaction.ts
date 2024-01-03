import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionDomain } from "../domain/transaction";
import { TransactionQuery } from "@query.handler/services/query";

export class TransactionController {;
  private static readonly transactionDomain = new TransactionDomain(new TransactionQuery());

  public static async deposit(req: FastifyRequest<{ Body: DepositDTO;}>, reply: FastifyReply) {
    const body = req.body;
    const depositInput = new DepositDTO(body.amount, body.currency, body.wallet);
    const output = await this.transactionDomain.deposit(depositInput);
    
    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }

  public static async list(req: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) {
    const wallet = req.params.wallet;
    const output = await this.transactionDomain.list(wallet);

    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(200);
    return output;
  }
}

export class DepositDTO {
  constructor(
    public amount: number, 
    public currency: string, 
    public wallet: string
  ) {}

  toString() {
    return `DepositDTO(amount: ${this.amount}, currency: ${this.currency}, wallet: ${this.wallet})`;
  }
}