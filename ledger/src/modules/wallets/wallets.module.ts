import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './persistence/wallet.entity';
import { WalletRepository } from './persistence/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity])],
  providers: [WalletRepository],
  exports: [WalletRepository],
})
export class WalletsModule {}
