import { Injectable } from '@nestjs/common';

import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from '@crawl-web-api/entities';
import { Repository } from 'typeorm';
import { ApartmentCreateDto } from './dto/apartmentCreate.dto';
import { toNumberOrNull } from '@crawl-web-api/utils/number';

@Injectable()
export class ApartmentService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
  ) {
    this.logger.setContext(ApartmentService.name);
  }

  async createApartment(data: ApartmentCreateDto) {
    const { apartmentInfo, apartmentAddress } = data;

    const apartment = await this.apartmentRepository.save(
      this.apartmentRepository.create({
        ...apartmentInfo,
        ...apartmentAddress,
        acreage: toNumberOrNull(apartmentInfo.acreage),
        apartmentFloor: toNumberOrNull(apartmentInfo.apartmentFloor),
        numberOfBedRoom: toNumberOrNull(apartmentInfo.numberOfBedRoom),
        numberOfToilet: toNumberOrNull(apartmentInfo.numberOfToilet),
        numberOfFloor: toNumberOrNull(apartmentInfo.numberOfFloor),
        pricePerSquareMeter: toNumberOrNull(apartmentInfo.pricePerSquareMeter),
        price: toNumberOrNull(apartmentInfo.price),
      }),
    );

    return apartment;
  }
}
