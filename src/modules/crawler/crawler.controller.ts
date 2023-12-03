import { Controller, Get, Inject, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';

@Controller('crawler')
@ApiTags('crawler')
export class CrawlerController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @Post('/')
  async crawl(@Res() res, @Query() query: any) {
    this.kafkaService.sendKafkaMessageWithoutKey(
      KAFKA_TOPIC_PRODUCER.WEBSITE_CRAWL,
      {
        url: 'http',
      },
    );

    return;
  }
}
