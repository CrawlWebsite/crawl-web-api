import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role } from '@crawl-web-api/entities';

import { DatabaseModule } from '@crawl-web-api/module-database/database.module';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';

import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
  providers: [SeederService, Logger],
})
export class SeederModule {}
