import { Module } from '@nestjs/common';

import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { Sale } from '@crawl-web-api/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Sale])],
  providers: [SaleService],
  controllers: [SaleController],
  exports: [SaleService],
})
export class SaleModule {}
