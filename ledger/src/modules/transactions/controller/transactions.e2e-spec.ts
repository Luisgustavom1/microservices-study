import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../app.module';
import { Transaction, TransactionStatus } from '../domain/entities/transaction';
import { TRANSACTION_STARTED_PUBLISHER } from '../domain/events/transaction-started.domain-event';
import { TransactionEvents } from '../domain/events/events';
import {
  createTransactionStartedPublisherMock,
  expectedTransactionStartedEvent,
} from '../../../../test/mocks/transaction-started-publisher.mock';
import { TypeOrmTransactionEntity } from '../infrastructure/transaction/transaction.entity';
import { LedgerWalletReader } from '../infrastructure/wallets/ledger-wallet.reader';
import { createWalletReaderMock } from '../../../../test/mocks/wallet-reader.mock';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let publishMock: jest.Mock<Promise<void>, [TransactionEvents]>;

  const originWalletId = '11111111-1111-4111-8111-111111111111';
  const destinationWalletId = '22222222-2222-4222-8222-222222222222';
  const baseIdempotencyKey = '550e8400-e29b-41d4-a716-446655440000';

  beforeAll(async () => {
    const transactionStartedPublisherMock =
      createTransactionStartedPublisherMock();
    publishMock = transactionStartedPublisherMock.publishMock;
    const walletReaderMock = createWalletReaderMock();
    walletReaderMock.getByIdMock.mockImplementation((walletId) => {
      if (walletId === originWalletId) {
        return Promise.resolve({
          id: originWalletId,
          email: 'origin@test.local',
          balance: '1000',
        });
      }

      if (walletId === destinationWalletId) {
        return Promise.resolve({
          id: destinationWalletId,
          email: 'destination@test.local',
          balance: '0',
        });
      }

      return Promise.resolve(null);
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TRANSACTION_STARTED_PUBLISHER)
      .useValue(transactionStartedPublisherMock.publisher)
      .overrideProvider(LedgerWalletReader)
      .useValue(walletReaderMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    await dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await dataSource.query('CREATE SCHEMA IF NOT EXISTS "transactions"');
    await dataSource.query(
      'DROP TABLE IF EXISTS "transactions"."transactions"',
    );
    await dataSource.query(`
      CREATE TABLE "transactions"."transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "origin_wallet_id" uuid NOT NULL,
        "destination_wallet_id" uuid NOT NULL,
        "amount" numeric(18,2) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "idempotency_key" character varying(255) NOT NULL,
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id")
      )
    `);
    await dataSource.query(
      'CREATE UNIQUE INDEX "IDX_transactions_idempotency_key" ON "transactions"."transactions" ("idempotency_key")',
    );
  });

  beforeEach(() => {
    publishMock.mockClear();
  });

  it('POST /transactions', async () => {
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId,
        amount: '150.5',
        idempotencyKey: `${baseIdempotencyKey}-success`,
      })
      .expect(201);

    const body = response.body as Transaction;

    expect(body).toMatchObject({
      status: TransactionStatus.PENDING,
    });
    expect(body.id).toEqual(expect.any(String));
    expect(body.createdAt).toEqual(expect.any(String));

    const savedTransactions: Array<Transaction> = await dataSource.query(
      'SELECT * FROM transactions.transactions WHERE origin_wallet_id = $1 AND destination_wallet_id = $2',
      [originWalletId, destinationWalletId],
    );

    expect(savedTransactions).toHaveLength(1);
    expect(savedTransactions[0]).toMatchObject({
      origin_wallet_id: originWalletId,
      destination_wallet_id: destinationWalletId,
      amount: '150.50',
      status: TransactionStatus.PENDING,
    });

    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledWith(
      expectedTransactionStartedEvent({
        originWalletId,
        destinationWalletId,
        amount: '150.50',
        status: TransactionStatus.PENDING,
      }),
    );
  });

  it('rejects amount greater than origin wallet balance', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId,
        amount: '1000.01',
        idempotencyKey: `${baseIdempotencyKey}-insufficient-balance`,
      })
      .expect(400)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe(
          'amount must be less than or equal to origin wallet balance',
        );
      });

    expect(publishMock).not.toHaveBeenCalled();
  });

  it('rejects if the origin wallet does not exist', async () => {
    const nonExistentWalletId = '99999999-9999-4999-8999-999999999999';

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId: nonExistentWalletId,
        destinationWalletId,
        amount: '1000.01',
        idempotencyKey: `${baseIdempotencyKey}-missing-origin`,
      })
      .expect(400)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe('originWalletId wallet not found');
      });
  });

  it('rejects if the destination wallet does not exist', async () => {
    const nonExistentWalletId = '99999999-9999-4999-8999-999999999999';

    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId: nonExistentWalletId,
        amount: '100',
        idempotencyKey: `${baseIdempotencyKey}-missing-destination`,
      })
      .expect(400)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe('destinationWalletId wallet not found');
      });
  });

  it('returns cached transaction on duplicate idempotency key', async () => {
    const idempotencyKey = `${baseIdempotencyKey}-duplicate-cache`;

    const firstResponse = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId,
        amount: '100',
        idempotencyKey,
      })
      .expect(201);

    const firstTransactionId = (firstResponse.body as { id: string }).id;
    expect(publishMock).toHaveBeenCalledTimes(1);
    publishMock.mockClear();

    const secondResponse = await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId,
        amount: '100',
        idempotencyKey,
      })
      .expect(201);

    const secondTransactionId = (secondResponse.body as { id: string }).id;

    expect(secondTransactionId).toBe(firstTransactionId);
    expect(publishMock).not.toHaveBeenCalled();

    const savedTransactions: Array<{ id: string }> = await dataSource
      .getRepository(TypeOrmTransactionEntity)
      .find({
        where: {
          idempotencyKey,
        },
      });
    expect(savedTransactions).toHaveLength(1);
    expect(savedTransactions[0].id).toBe(firstTransactionId);
  });

  it('rejects request without idempotency key', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId,
        destinationWalletId,
        amount: '100',
        // idempotencyKey intentionally omitted
      })
      .expect(400);
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM transactions.transactions');
    await app.close();
  });
});
