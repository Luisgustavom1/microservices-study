import { Body, Controller, Post } from '@nestjs/common';
import type { StartTransactionRequest } from '../application/dto/start-transaction.request';
import { StartTransactionUseCase } from '../application/use-cases/start-transaction.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly startTransactionUseCase: StartTransactionUseCase,
  ) {}

  @Post()
  create(@Body() request: StartTransactionRequest) {
    return this.startTransactionUseCase.execute(request);
  }
}
