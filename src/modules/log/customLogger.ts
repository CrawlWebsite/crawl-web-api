import { Injectable, Inject, Scope } from '@nestjs/common';

import Logger, { LoggerBaseKey } from './interfaces/logger';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { INQUIRER } from '@nestjs/core';
import { IConfig } from 'config';
import { LogData, LogLevel } from './interfaces/log';
import LocalStorageService, {
  LocalStorageServiceKey,
} from '@crawl-web-api/module-local-storage/interfaces/localStorageService';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements Logger {
  private sourceClass: string;
  private organization: string;
  private app: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: Logger,
    @Inject(CONFIG) private readonly configService: IConfig,
    @Inject(INQUIRER) parentClass: object,
    @Inject(LocalStorageServiceKey)
    private localStorageService: LocalStorageService,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;

    // Set the organization, context and app from the environment variables
    this.organization = configService.get<string>('context.organization');
    this.app = configService.get<string>('context.app');
  }

  public log(level: LogLevel, message: string | Error, data?: LogData) {
    return this.logger.log(level, message, this.getLogData(data));
  }

  public debug(message: string, data?: LogData) {
    return this.logger.debug(message, this.getLogData(data));
  }

  public info(message: string, data?: LogData) {
    return this.logger.info(message, this.getLogData(data));
  }

  public warn(message: string | Error, data?: LogData) {
    return this.logger.warn(message, this.getLogData(data));
  }

  public error(message: string | Error, data?: LogData) {
    return this.logger.error(message, this.getLogData(data));
  }

  public fatal(message: string | Error, data?: LogData) {
    return this.logger.fatal(message, this.getLogData(data));
  }

  public emergency(message: string | Error, data?: LogData) {
    return this.logger.emergency(message, this.getLogData(data));
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId: data?.correlationId || this.localStorageService.getId(),
    };
  }
}
