import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { Publisher } from '@crawl-web-api/entities';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Publisher])],
  providers: [PublisherService],
  controllers: [PublisherController],
  exports: [PublisherService],
})
export class PublisherModule {}
