import { AccountQueryRepository } from "@query.handler/repository/account.query.repository";

export class AccountDomain {
  constructor (
    private readonly accountRepo: AccountQueryRepository,
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
}