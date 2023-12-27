import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
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
import { JwtAuthGuard } from '@crawl-web-api/module-auth/guard';

@Controller('crawler')
@ApiTags('Crawler')
export class CrawlerController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async crawlRegister(@Req() request, @Body() data: CrawlRegisterDto) {
    this.logger.log(`Crawl registration ${data}`, this.crawlRegister.name);
    const { user } = request;

    const newCrawlProcess = await this.crawlerService.registerCrawler(
      user?.id,
      data,
    );

    return newCrawlProcess;
  }
}
