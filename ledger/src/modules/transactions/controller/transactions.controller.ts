import { Body, Controller, Post } from '@nestjs/common';
import type { CreateTransactionIntentRequest } from '../application/dto/create-transaction-intent.request';
import type { Transaction } from '../domain/entities/transaction';
import { CreateTransactionIntentUseCase } from '../application/use-cases/create-transaction-intent.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionIntentUseCase: CreateTransactionIntentUseCase,
  ) {}

  @Post()
  create(
    @Body() request: CreateTransactionIntentRequest,
  ): Promise<Transaction> {
    return this.createTransactionIntentUseCase.execute(request);
  }
}
