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
import { WalletEntity } from '../../wallets/persistence/wallet.entity';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let publishMock: jest.Mock<Promise<void>, [TransactionEvents]>;

  const originWalletId = '11111111-1111-4111-8111-111111111111';
  const destinationWalletId = '22222222-2222-4222-8222-222222222222';

  beforeAll(async () => {
    const transactionStartedPublisherMock =
      createTransactionStartedPublisherMock();
    publishMock = transactionStartedPublisherMock.publishMock;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TRANSACTION_STARTED_PUBLISHER)
      .useValue(transactionStartedPublisherMock.publisher)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    await Promise.all([
      dataSource.manager.save(WalletEntity, {
        id: originWalletId,
        email: 'origin@test.local',
        balance: '1000',
      }),
      dataSource.manager.save(WalletEntity, {
        id: destinationWalletId,
        email: 'destination@test.local',
        balance: '0',
      }),
    ]);
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
      })
      .expect(201);

    const body = response.body as Transaction;

    expect(body).toMatchObject({
      status: TransactionStatus.PENDING,
    });
    expect(body.id).toEqual(expect.any(String));
    expect(body.createdAt).toEqual(expect.any(String));

    const savedTransactions: Array<Transaction> = await dataSource.query(
      'SELECT * FROM transactions WHERE origin_wallet_id = $1 AND destination_wallet_id = $2',
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
      })
      .expect(400)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe('destinationWalletId wallet not found');
      });
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM transactions');
    await dataSource.query('DELETE FROM wallets');
    await app.close();
  });
});
