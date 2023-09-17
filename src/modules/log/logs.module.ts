import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@microservice-auth/module-config/config.module';
import { Log } from '@microservice-auth/entities';

import LogsService from './logs.service';
import CustomLogger from './customLogger';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
