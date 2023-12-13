import { Module } from '@nestjs/common';

import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';

import { CrawlerController } from './crawler.controller';
import { CrawlerMessageController } from './crawler.message';

import { CrawlerService } from './crawler.service';
import { SaleModule } from '@crawl-web-api/module-sale/sale.module';
import { ApartmentModule } from '@crawl-web-api/module-apartment/apartment.module';
import { ApartmentSaleModule } from '@crawl-web-api/module-apartment-sale/apartmentSale.module';
import { PublisherModule } from '@crawl-web-api/module-publisher/publisher.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    KafkaModule,
    SaleModule,
    ApartmentModule,
    ApartmentSaleModule,
    PublisherModule,
  ],
  providers: [CrawlerService],
  controllers: [CrawlerController, CrawlerMessageController],
})
export class CrawlerModule {}
