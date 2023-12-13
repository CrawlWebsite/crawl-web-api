import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';
import { ApartmentSale } from '@crawl-web-api/entities';
import { ApartmentSaleController } from './apartmentSale.controller';
import { ApartmentSaleService } from './apartmentSale.service';

@Module({
  imports: [
    LoggerModule,
    KafkaModule,
    TypeOrmModule.forFeature([ApartmentSale]),
  ],
  providers: [ApartmentSaleService],
  controllers: [ApartmentSaleController],
  exports: [ApartmentSaleService],
})
export class ApartmentSaleModule {}
