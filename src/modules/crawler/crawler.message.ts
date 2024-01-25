import { Controller, ValidationPipe } from '@nestjs/common';

// Service
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { KAFKA_TOPIC_CONSUMER } from '@crawl-web-api/module-kafka/dto';
import { CrawlApartmentDataDto } from './dto/crawlData.dto';
import { SaleService } from '@crawl-web-api/module-sale/sale.service';
import { ApartmentService } from '@crawl-web-api/module-apartment/apartment.service';
import { ApartmentSaleService } from '@crawl-web-api/module-apartment-sale/apartmentSale.service';
import { PublisherService } from '@crawl-web-api/module-publisher/publisher.service';
import { CustomLogger } from '@crawl-web-api/module-log/customLogger';

@Controller()
export class CrawlerMessageController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    private readonly saleService: SaleService,
    private readonly apartmentService: ApartmentService,
    private readonly apartmentSaleService: ApartmentSaleService,
    private readonly publisherService: PublisherService,
  ) {}

  @MessagePattern(KAFKA_TOPIC_CONSUMER.WEBSITE_CRAWL_DATA)
  async streamWebsiteData(
    @Payload('value', ValidationPipe) payload: CrawlApartmentDataDto,
  ) {
    try {
      this.logger.info(`Streaming data ${JSON.stringify(payload)}`);

      const {
        publisher: publisherData,
        sale: saleData,
        apartmentSale,
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

      // Get publisher
      const publisher = await this.publisherService.createPublisher(
        publisherData,
      );

      // Create apartment sale
      await this.apartmentSaleService.createApartmentSale({
        ...apartmentSale,
        publisher,
        apartment,
        sale,
      });

      return;
    } catch (err) {
      this.logger.error(err, err.stack);
      throw new RpcException(err);
    }
  }
}
