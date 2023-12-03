import { Module } from '@nestjs/common';

import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { WebPageController } from './webPage.controller';
import { WebPageService } from './webPage.service';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [WebPageService],
  controllers: [WebPageController],
})
export class WebPageModule {}
