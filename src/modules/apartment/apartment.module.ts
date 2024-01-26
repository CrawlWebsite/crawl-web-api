import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { Apartment } from '@crawl-web-api/entities';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Apartment])],
  providers: [ApartmentService],
  controllers: [ApartmentController],
  exports: [ApartmentService],
})
export class ApartmentModule {}
