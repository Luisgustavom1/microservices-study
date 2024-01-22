import { Listener } from "@event-bus/Listener";
import { QueryReplicateEventData } from "@shared/event-bus/events/query.replicate.event";
import { TransactionQueryRepository } from "@query.handler/repository/transaction.query.repository";
import { AccountQueryRepository } from "./repository/account.query.repository";

export class QueryListener implements Listener {
  constructor(
    private readonly transactionRepo: TransactionQueryRepository,
    private readonly accountRepo: AccountQueryRepository,
  ) {}

  async execute({ account, transaction }: QueryReplicateEventData): Promise<void> {
    await Promise.all([
      this.transactionRepo.save(transaction),
      this.accountRepo.update(account),
    ]);
  }
}