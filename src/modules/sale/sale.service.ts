import { Injectable } from '@nestjs/common';

import { CustomLogger } from '@crawl-web-api/module-log/customLogger';
import { SaleCreateDto } from './dto/saleCreate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from '@crawl-web-api/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SaleService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
  ) {}

  async upsertSale(data: SaleCreateDto) {
    const { phoneNumber } = data;

    if (!phoneNumber) {
      this.logger.error('Sale phone number is required');
      return;
    }

    await this.saleRepository.upsert(data, {
      conflictPaths: ['phoneNumber'],
      skipUpdateIfNoValuesChanged: true,
    });

    const sale = await this.saleRepository.findOne({ where: { phoneNumber } });

    return sale;
  }
}
