import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IConfig } from 'config';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import CustomLogger from '@crawl-web-api/module-log/customLogger';

@Injectable()
export class CrawlerService {
  constructor(
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(CrawlerService.name);
  }
}
