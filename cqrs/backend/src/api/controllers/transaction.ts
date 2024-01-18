import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionDomain } from "../domain/transaction";
import { TransactionQuery } from "@query.handler/repository/transaction.query";

export class TransactionController {;
  private static readonly transactionDomain = new TransactionDomain(new TransactionQuery());

  public static async deposit(req: FastifyRequest<{ Body: TransactionDTO;}>, reply: FastifyReply) {
    const input = this.transactionHandler(req);
    const output = await this.transactionDomain.deposit(input);
    
    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }

  public static async withdrawal(req: FastifyRequest<{ Body: TransactionDTO;}>, reply: FastifyReply) {
    const input = this.transactionHandler(req);
    const output = await this.transactionDomain.withdraw(input);
    
    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }

  private static transactionHandler(req: FastifyRequest<{ Body: TransactionDTO;}>) {
    const body = req.body;
    const transactionInput = new TransactionDTO(body.amount, body.currency, body.wallet);
    return transactionInput
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

export class TransactionDTO {
  constructor(
    public amount: number, 
    public currency: string, 
    public wallet: string
  ) {}

  toString() {
    return `TransactionDTO(amount: ${this.amount}, currency: ${this.currency}, wallet: ${this.wallet})`;
  }
}