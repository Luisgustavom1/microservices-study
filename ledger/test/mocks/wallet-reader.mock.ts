import { WalletSnapshot } from '../../src/modules/transactions/infrastructure/wallets/ledger-wallet.reader';

export interface WalletReaderMock {
  getByIdMock: jest.Mock<Promise<WalletSnapshot | null>, [string]>;
}

export interface WalletSnapshotExpectationInput {
  id: string;
  email: string;
  balance: string;
}

export function createWalletReaderMock(): WalletReaderMock {
  const getByIdMock = jest.fn<Promise<WalletSnapshot | null>, [string]>();
  getByIdMock.mockResolvedValue(null);

  return {
    getByIdMock,
  };
}

export function expectedWalletSnapshot(
  input: WalletSnapshotExpectationInput,
): WalletSnapshot {
  return {
    id: input.id,
    email: input.email,
    balance: input.balance,
  };
}
