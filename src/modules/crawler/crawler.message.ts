import { Controller } from '@nestjs/common';

// Service
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPIC_CONSUMER } from '@crawl-web-api/module-kafka/dto';
import { CrawlApartmentDataDto } from './dto/crawlData.dto';
import { SaleService } from '@crawl-web-api/module-sale/sale.service';
import { ApartmentService } from '@crawl-web-api/module-apartment/apartment.service';
import { ApartmentSaleService } from '@crawl-web-api/module-apartment-sale/apartmentSale.service';

@Controller()
export class CrawlerMessageController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    private readonly saleService: SaleService,
    private readonly apartmentService: ApartmentService,
    private readonly apartmentSaleService: ApartmentSaleService,
  ) {}

  @MessagePattern(KAFKA_TOPIC_CONSUMER.WEBSITE_CRAWL_DATA)
  async streamWebsiteData(@Payload() payload: CrawlApartmentDataDto) {
    console.log(payload);
    const {
      sale: saleData,
      salePost,
      apartmentInfo,
      apartmentAddress,
    } = payload;

    // Upsert sale data
    const sale = await this.saleService.upsertSale(saleData);

    // Create apartment information
    const apartment = await this.apartmentService.createApartment({
      apartmentInfo,
      apartmentAddress,
    });

    // Create apartment sale
    await this.apartmentSaleService.createApartmentSale({
      ...salePost,
      apartment,
      sale,
    });
  }
}
