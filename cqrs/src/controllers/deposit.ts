import { FastifyRequest } from "fastify";

export class DepositController {
  public static deposit(req: FastifyRequest<{ Body: DepositInputDTO;}>) {
    const body = req.body;
    const depositInput = new DepositInputDTO(body.amount, body.currency, body.wallet);
  }

  public static withdraw() {}

  public static list() {}
}

export class DepositInputDTO {
  constructor(
    public amount: number, 
    public currency: string, 
    public wallet: string
  ) {}
}