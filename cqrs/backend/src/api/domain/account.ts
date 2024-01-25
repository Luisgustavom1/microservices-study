import { AccountCommandRepository } from "@command.handler/repository/account.command.repository";
import { AccountQueryRepository } from "@query.handler/repository/account.query.repository";

export class AccountDomain {
  constructor (
    private readonly accountRepo: AccountQueryRepository,
    private readonly accountCommand: AccountCommandRepository,
  ) {}

  public async getByWallet(wallet: string) {
    try {
      const account = await this.accountRepo.getByWallet({ wallet });
      return { success: true, data: account }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }

  public async list() {
    try {
      const accounts = await this.accountCommand.list();
      return { success: true, data: accounts }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}