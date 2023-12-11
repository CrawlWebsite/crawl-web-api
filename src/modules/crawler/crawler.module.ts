import { Module } from '@nestjs/common';

import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';

import { CrawlerController } from './crawler.controller';
import { CrawlerMessageController } from './crawler.message';

import { CrawlerService } from './crawler.service';

@Module({
  imports: [ConfigModule, LoggerModule, KafkaModule],
  providers: [CrawlerService],
  controllers: [CrawlerController, CrawlerMessageController],
})
export class CrawlerModule {}
