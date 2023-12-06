import { Module } from '@nestjs/common';

import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';

@Module({
  imports: [ConfigModule, LoggerModule, KafkaModule],
  providers: [CrawlerService],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
