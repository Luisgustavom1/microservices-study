import { OptionalId } from "mongodb";
import { collections } from "../db";
import { AccountQueryRepository } from "./account.query.repository";
import { Account } from "@query.handler/models/Account";

export class AccountQuery implements AccountQueryRepository {
  public async getByWallet(where: { wallet: string }) {
    if (!collections.account) throw new Error("Collection not found");
    return collections.account?.findOne(where);
  }

  public async update(values: OptionalId<Account>) {
    if (!collections.account) throw new Error("Collection not found");
    return collections.account?.updateOne({ wallet: values.wallet }, { $set: values }, { upsert: true });
  }
}