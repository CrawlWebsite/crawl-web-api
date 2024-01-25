import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { CustomLogger } from '@crawl-web-api/module-log/customLogger';
import { JwtAuthGuard } from '@crawl-web-api/module-auth/guard';
import { CrawlerService } from './crawler.service';

import RegisterCrawlProcessDto from './dto/registerCrawlerProcess.dto';
import { RolePermission } from '@crawl-web-api/module-auth/guard/roles.metadata';
import { Roles } from '@crawl-web-api/entities';
import {
  GetCrawlProcessByUserDto,
  GetSubCrawlProcessByAdminDto,
} from './dto/getCrawlerProcess.dto';
import { BaseController } from '@crawl-web-api/module-base/base.controller';
import { RoleGuard } from '@crawl-web-api/module-auth/guard/role.guard';

@ApiTags('Crawler')
@Controller('crawler')
export class CrawlerController extends BaseController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {
    super();
  }

  @RolePermission(Roles.MEMBER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/crawler-process')
  async getCrawlerProcessesByUser(
    @Req() request,
    @Query() queries: GetCrawlProcessByUserDto,
  ) {
    this.logger.info(`Get crawler processes by user`);

    const user = request.user;

    const result = await this.crawlerService.getCrawlProcesses({
      ...queries,
      userIds: [user?.id],
    });

    return result;
  }

  @RolePermission(Roles.MEMBER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/crawler-process/:crawlerProcessId/sub')
  async getSubCrawlerProcessesByUser(
    @Req() request,
    @Param() params: { crawlerProcessId: number },
    @Query() queries: GetSubCrawlProcessByAdminDto,
  ) {
    this.logger.info(`Get crawler sub processes by user ${queries}`);

    const user = request.user;
    const { crawlerProcessId } = params;

    if (!crawlerProcessId) {
      throw {
        message: 'Crawler process id does not exist',
      };
    }

    const result = await this.crawlerService.getSubCrawlProcesses(
      crawlerProcessId,
      {
        ...queries,
        userIds: [user?.id],
      },
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/crawler-process')
  async crawlRegister(@Req() request, @Body() data: RegisterCrawlProcessDto) {
    this.logger.info(`Crawl registration ${data}`);
    const { user } = request;

    const newCrawlProcess = await this.crawlerService.registerCrawler(
      user?.id,
      data,
    );

    return newCrawlProcess;
  }
}
