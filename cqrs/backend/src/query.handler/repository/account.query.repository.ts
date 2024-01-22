import { Account } from "@query.handler/models/Account";
import { OptionalId, UpdateResult, WithId } from "mongodb";

export interface AccountQueryRepository {
  getByWallet(where: { wallet: string }): Promise<WithId<Account> | null>;
  update(values: OptionalId<Account>): Promise<UpdateResult<Account> | undefined>;
}