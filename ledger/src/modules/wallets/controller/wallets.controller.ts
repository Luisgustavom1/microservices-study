import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { WalletRepository } from '../persistence/wallet/wallet.repository';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletRepository: WalletRepository) {}

  @Get(':walletId')
  async findById(@Param('walletId') walletId: string) {
    const wallet = await this.walletRepository.getById(walletId);

    if (!wallet) {
      throw new NotFoundException('wallet not found');
    }

    return wallet;
  }
}
