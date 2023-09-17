import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Role } from '@microservice-auth/entities';

import { DatabaseModule } from '@microservice-auth/module-database/database.module';
import { ConfigModule } from '@microservice-auth/module-config/config.module';

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
