import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';
import CrawlRegisterDto from './dto/crawlRegister.dto';
import CustomLogger from '@crawl-web-api/module-log/customLogger';

@Controller('crawler')
@ApiTags('Crawler')
export class CrawlerController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @Post('/')
  async crawlRegister(@Body() data: CrawlRegisterDto) {
    this.logger.log(`Crawl registration ${data}`, this.crawlRegister.name);

    const { url, startPage, endPage } = data;

    this.kafkaService.sendKafkaMessageWithoutKey(
      KAFKA_TOPIC_PRODUCER.WEBSITE_CRAWL_REGISTER,
      {
        url,
        startPage,
        endPage,
      },
    );

    return;
  }
}
