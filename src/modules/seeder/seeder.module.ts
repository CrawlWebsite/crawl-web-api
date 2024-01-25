import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role, CrawlProcess } from '@crawl-web-api/entities';

import { DatabaseModule } from '@crawl-web-api/module-database/database.module';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';

import { SeederService } from './seeder.service';
import { LoggerModule } from '@crawl-web-api/module-log/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Role, CrawlProcess]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
