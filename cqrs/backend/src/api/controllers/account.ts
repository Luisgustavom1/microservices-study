import { FastifyReply, FastifyRequest } from "fastify";
import { AccountCommand } from "@command.handler/repository/account.command";
import { AccountDomain } from "../domain/account";

export class AccountController {
  private static readonly accountDomain = new AccountDomain(new AccountCommand());

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
}