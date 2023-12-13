import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentSale } from '@crawl-web-api/entities';
import { toDateOrNull } from '@crawl-web-api/utils/date';
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
    const { url } = data;

    if (!url) {
      this.logger.error(
        'Sale url is required',
        'Create Apartment Sale',
        this.createApartmentSale.name,
      );
      return;
    }

    await this.apartmentSaleRepository.upsert(
      {
        ...data,
        startDate: toDateOrNull(data.startDate),
        endDate: toDateOrNull(data.endDate),
      },
      {
        conflictPaths: ['url'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    return;
  }
}
