import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Service
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { ApartmentSaleService } from './apartmentSale.service';

@Controller('apartment-sale')
@ApiTags('ApartmentSale')
export class ApartmentSaleController {
  constructor(
    private readonly apartmentSaleService: ApartmentSaleService,
    private readonly kafkaService: KafkaService,
  ) {}
}
