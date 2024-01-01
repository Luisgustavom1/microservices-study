import { DepositDTO } from "../controllers/deposit";

export class DepositDomain {
  public deposit(depositInput: DepositDTO) {
    console.log("vou depositar", depositInput.toString());
  }

  public withdraw() {}

  public list() {}
}