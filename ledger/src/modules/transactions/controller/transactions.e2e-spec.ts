/// <reference types="jest" />
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../app.module';
import { Transaction, TransactionStatus } from '../domain/entities/transaction';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  const originWalletId = '11111111-1111-4111-8111-111111111111';
  const destinationWalletId = '22222222-2222-4222-8222-222222222222';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);

    await dataSource.query(
      'INSERT INTO wallets (id, email, balance) VALUES ($1, $2, 1000), ($3, $4, 0)',
      [
        originWalletId,
        'origin-wallet@test.local',
        destinationWalletId,
        'destination-wallet@test.local',
      ],
    );
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
      originWalletId,
      destinationWalletId,
      amount: '150.50',
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
  });

  it('rejects invalid payloads', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        originWalletId: 'not-a-uuid',
        destinationWalletId,
        amount: '150.5',
      })
      .expect(400)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe('originWalletId must be a valid UUID');
      });
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
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM transactions');
    await dataSource.query('DELETE FROM wallets');
    await app.close();
  });
});
