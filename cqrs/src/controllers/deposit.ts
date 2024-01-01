import { FastifyRequest } from "fastify";
import { DepositDomain } from "../domain/deposit";

export class DepositController {;
  private static readonly depositDomain = new DepositDomain();

  public static deposit(req: FastifyRequest<{ Body: DepositDTO;}>) {
    const body = req.body;
    const depositInput = new DepositDTO(body.amount, body.currency, body.wallet);
    this.depositDomain.deposit(depositInput);
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