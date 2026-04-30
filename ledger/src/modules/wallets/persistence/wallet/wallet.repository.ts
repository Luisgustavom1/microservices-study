import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async getBalance(walletId: string): Promise<string | null> {
    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
      select: ['balance'],
    });

    return wallet?.balance ?? null;
  }

  async getById(walletId: string): Promise<WalletEntity | null> {
    return this.walletRepository.findOne({
      where: { id: walletId },
    });
  }
}
