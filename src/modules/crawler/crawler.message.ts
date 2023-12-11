import { Controller, Inject } from '@nestjs/common';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPIC_CONSUMER } from '@crawl-web-api/module-kafka/dto';

@Controller()
export class CrawlerMessageController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @MessagePattern(KAFKA_TOPIC_CONSUMER.WEBSITE_CRAWL_DATA)
  killDragon(@Payload() message: any): any {
    console.log(message);

    return;
  }
}
