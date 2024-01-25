import { FastifyReply, FastifyRequest } from "fastify";
import { AccountDomain } from "../domain/account";
import { AccountQuery } from "@query.handler/repository/account.query";
import { AccountCommand } from "@command.handler/repository/account.command";

export class AccountController {
  private static readonly accountDomain = new AccountDomain(new AccountQuery(), new AccountCommand());

  public static async getByWallet(req: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) {
    const input = req.params.wallet
    const output = await this.accountDomain.getByWallet(input);
    
    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }

  public static async list(_: FastifyRequest, reply: FastifyReply) {
    const output = await this.accountDomain.list();
    
    if (!output.success) {
      reply.code(400);
      return output;
    }

    reply.code(201);
    return output;
  }
}