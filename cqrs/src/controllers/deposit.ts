import { FastifyReply, FastifyRequest } from "fastify";
import { DepositDomain } from "../domain/deposit";

export class DepositController {;
  private static readonly depositDomain = new DepositDomain();

  public static async deposit(req: FastifyRequest<{ Body: DepositDTO;}>, reply: FastifyReply) {
    const body = req.body;
    const depositInput = new DepositDTO(body.amount, body.currency, body.wallet);
    const output = await this.depositDomain.deposit(depositInput);

    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }

  public static withdraw() {}

  public static list() {}
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