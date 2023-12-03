import { Controller, Get, Inject, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { WebPageService } from './webPage.service';

@Controller('web-page')
@ApiTags('web-page')
export class WebPageController {
  constructor(
    private readonly webPageService: WebPageService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @Get('/')
  async getPageContent(@Res() res, @Query() query: any) {
    try {
      const pageContent = await this.webPageService.getPageContent(query);

      res.send(pageContent);
    } catch (err) {
      res.sendStatus(404);
    }
  }
}
