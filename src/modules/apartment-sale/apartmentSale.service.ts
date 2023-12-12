import { Injectable } from '@nestjs/common';

import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentSale } from '@crawl-web-api/entities';
import { Repository } from 'typeorm';
import { ApartmentSaleCreateDto } from './dto/apartmentSaleCreate.dto';

@Injectable()
export class ApartmentSaleService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(ApartmentSale)
    private apartmentSaleRepository: Repository<ApartmentSale>,
  ) {
    this.logger.setContext(ApartmentSaleService.name);
  }

  async createApartmentSale(data: ApartmentSaleCreateDto) {
    return;
  }
}
