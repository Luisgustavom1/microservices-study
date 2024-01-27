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
      return { success: true, data: accounts.map((acc) => new ListAccountsDTO(acc.id, acc.type, acc.wallet)) }
    } catch (error) {
      console.log("[ERROR]", error);
      return { success: false, error: "Tente novamente mais tarde" };
    }
  }
}

class ListAccountsDTO {
  constructor (
    public readonly id: number,
    public readonly type: string,
    public readonly wallet: string,
  ) {}
}