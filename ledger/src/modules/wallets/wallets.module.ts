import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './controller/wallets.controller';
import { WalletEntity } from './persistence/wallet/wallet.entity';
import { WalletRepository } from './persistence/wallet/wallet.repository';
import { LedgerEntriesEntity } from './persistence/ledger-entries/ledger-entries.entity';
import { LedgerEntriesRepository } from './persistence/ledger-entries/ledger-entries.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, LedgerEntriesEntity])],
  controllers: [WalletsController],
  providers: [WalletRepository, LedgerEntriesRepository],
  exports: [WalletRepository, LedgerEntriesRepository],
})
export class WalletsModule {}
