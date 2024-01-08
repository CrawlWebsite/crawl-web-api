import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { CrawlerService } from './crawler.service';

import { RolePermission } from '@crawl-web-api/module-auth/guard/roles.metadata';
import { Roles } from '@crawl-web-api/entities';
import {
  GetCrawlProcessByAdminDto,
  GetSubCrawlProcessByAdminDto,
} from './dto/getCrawlerProcess.dto';
import { JwtAuthGuard } from '@crawl-web-api/module-auth/guard';
import { RoleGuard } from '@crawl-web-api/module-auth/guard/role.guard';

@ApiTags('Crawler Admin')
@Controller('admin/crawler')
export class CrawlerAdminController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @RolePermission(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/crawler-process')
  async getCrawlerProcessesByAdmin(
    @Req() request,
    @Query() queries: GetCrawlProcessByAdminDto,
  ) {
    this.logger.log(
      `Get crawler processes by admin ${queries}`,
      this.getCrawlerProcessesByAdmin.name,
    );

    const result = await this.crawlerService.getCrawlProcesses(queries);

    return result;
  }

  @RolePermission(Roles.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/crawler-process/:crawlerProcessId/sub')
  async getSubCrawlerProcessesByAdmin(
    @Req() request,
    @Param() params: { crawlerProcessId: number },
    @Query() queries: GetSubCrawlProcessByAdminDto,
  ) {
    this.logger.log(
      `Get crawler sub processes by admin ${queries}`,
      this.getCrawlerProcessesByAdmin.name,
    );
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
      },
    );

    return result;
  }
}
