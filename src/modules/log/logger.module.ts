import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { Log } from '@crawl-web-api/entities';

import LoggerService from './logger.service';
import { CustomLogger } from './customLogger';
import NestjsLoggerServiceAdapter from './nestjsLoggerServiceAdapter';
import { LoggerBaseKey } from './interfaces/logger';
import PinoLogger from './pino/pinoLogger';
import { LocalStorageModule } from '@crawl-web-api/module-local-storage/localStorage.module';

@Module({
  imports: [
    ConfigModule,
    LocalStorageModule,
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
    TypeOrmModule.forFeature([Log]),
  ],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: PinoLogger,
    },
    NestjsLoggerServiceAdapter,
    CustomLogger,
    LoggerService,
  ],
  exports: [CustomLogger, NestjsLoggerServiceAdapter],
})
export class LoggerModule {}
