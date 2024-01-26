import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { SaleModule } from '@crawl-web-api/module-sale/sale.module';
import { ApartmentModule } from '@crawl-web-api/module-apartment/apartment.module';
import { ApartmentSaleModule } from '@crawl-web-api/module-apartment-sale/apartmentSale.module';
import { PublisherModule } from '@crawl-web-api/module-publisher/publisher.module';
import { UserModule } from '@crawl-web-api/module-user/user.module';

import { User, CrawlProcess } from '@crawl-web-api/entities';

import { CrawlerController } from './crawler.controller';
import { CrawlerMessageController } from './crawler.message';
import { CrawlerService } from './crawler.service';
import { CrawlerAdminController } from './crawler.admin.controller';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    KafkaModule,
    SaleModule,
    ApartmentModule,
    ApartmentSaleModule,
    PublisherModule,
    UserModule,
    TypeOrmModule.forFeature([User, CrawlProcess]),
  ],
  providers: [CrawlerService],
  controllers: [
    CrawlerAdminController,
    CrawlerController,
    CrawlerMessageController,
  ],
})
export class CrawlerModule {}
