import { AccountCommandRepository } from "@command.handler/repository/account.command.repository";

export class AccountDomain {
  constructor (
    private readonly accountRepo: AccountCommandRepository,
  ) {}

  public async getByWallet(wallet: string) {
    try {
      // TODO: get by query not command
      const account = await this.accountRepo.getByWallet(wallet);
      return { success: true, data: account }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}