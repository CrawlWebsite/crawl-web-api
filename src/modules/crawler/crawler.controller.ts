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
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';
import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { JwtAuthGuard } from '@crawl-web-api/module-auth/guard';
import { RoleGuard } from '@crawl-web-api/module-auth/guard/role.guard';
import { CrawlerService } from './crawler.service';

import RegisterCrawlerProcessDto from './dto/registerCrawlerProcess.dto';
import { RolePermission } from '@crawl-web-api/module-auth/guard/roles.metadata';
import { Roles } from '@crawl-web-api/entities';
import {
  GetCrawlerProcessByAdminDto,
  GetCrawlerProcessByUserDto,
} from './dto/getCrawlerProcess.dto';

@Controller('crawler')
@ApiTags('Crawler')
@UseGuards(RoleGuard)
export class CrawlerController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @UseGuards(JwtAuthGuard)
  @RolePermission(Roles.ADMIN)
  @Get('/admin/crawler-process')
  async getCrawlerProcessesByAdmin(
    @Req() request,
    @Body() data: GetCrawlerProcessByAdminDto,
  ) {
    this.logger.log(`Crawl registration ${data}`, this.crawlRegister.name);
    const { user } = request;

    const newCrawlProcess = await this.crawlerService.registerCrawler(
      user?.id,
      data,
    );

    return newCrawlProcess;
  }

  @UseGuards(JwtAuthGuard)
  @RolePermission(Roles.MEMBER)
  @Get('/crawler-process/:userId')
  async getCrawlerProcessesByUser(
    @Req() request,
    @Body() data: GetCrawlerProcessByUserDto,
  ) {
    this.logger.log(`Crawl registration ${data}`, this.crawlRegister.name);
    const { user } = request;

    const newCrawlProcess = await this.crawlerService.registerCrawler(
      user?.id,
      data,
    );

    return newCrawlProcess;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/crawler-process')
  async crawlRegister(@Req() request, @Body() data: RegisterCrawlerProcessDto) {
    this.logger.log(`Crawl registration ${data}`, this.crawlRegister.name);
    const { user } = request;

    const newCrawlProcess = await this.crawlerService.registerCrawler(
      user?.id,
      data,
    );

    return newCrawlProcess;
  }
}
