import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerEntriesEntity } from './ledger-entries.entity';

@Injectable()
export class LedgerEntriesRepository {
  constructor(
    @InjectRepository(LedgerEntriesEntity)
    private readonly ledgerEntryRepository: Repository<LedgerEntriesEntity>,
  ) {}

  async create(input: LedgerEntriesEntity): Promise<LedgerEntriesEntity> {
    return this.ledgerEntryRepository.save(input);
  }

  async findByWalletId(walletId: string): Promise<LedgerEntriesEntity[]> {
    return this.ledgerEntryRepository.find({ where: { walletId } });
  }
}
