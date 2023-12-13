import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IConfig } from 'config';
import axios from 'axios';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import CustomLogger from '@crawl-web-api/module-log/customLogger';

@Injectable()
export class WebPageService {
  constructor(
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(WebPageService.name);
  }

  async getPageContent(query) {
    try {
      const { cmd, path, postData } = query;
      this.logger.log(`Get page content: ${path}`, this.getPageContent.name);

      const proxyUrl =
        this.configService.get<string>('flare_solverr.host') ||
        'http://localhost:8191/v1';

      const response = await axios(proxyUrl, {
        method: 'POST',
        data: {
          cmd: `request.${cmd}`,
          url: path,
          postData,
          maxTimeout: 60000,
        },
      });

      return response?.data?.['solution']?.['response'];
    } catch (err) {
      console.error(err);
    }
  }
}
