import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { Log } from '@crawl-web-api/entities';
import { WinstonModule } from 'nest-winston';

import LogsService from './logs.service';
import CustomLogger from './customLogger';
import * as winston from 'winston';
import { configure, getLogger } from 'log4js';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'Logger',
      useValue: getLogger(),
    },
    CustomLogger,
    LogsService,
  ],
  exports: [CustomLogger, 'Logger'],
})
export class LoggerModule {
  constructor() {
    configure({
      appenders: {
        console: { type: 'console' },
        logstash: {
          type: 'log4js-logstash',
          host: 'localhost',
          port: 5000,
          layout: { type: 'pattern', pattern: '%m' },
        },
      },
      categories: {
        default: {
          appenders: ['console', 'logstash'],
          level: 'info',
        },
      },
    });
  }
}
