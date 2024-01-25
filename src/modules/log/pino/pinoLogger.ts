import { Inject, Injectable } from '@nestjs/common';
import * as pino from 'nestjs-pino';
import Logger from '../interfaces/logger';
import { LogData, LogLevel } from '../interfaces/log';

// export const WinstonLoggerTransportsKey = Symbol();

@Injectable()
export default class PinoLogger implements Logger {
  public constructor(private readonly logger: pino.PinoLogger) {
    // @Inject(WinstonLoggerTransportsKey) transports: winston.transport[],
    // Create winston logger
    // this.logger = pino.createLogger(this.getLoggerFormatOptions(transports));
  }

  //   private getLoggerFormatOptions(transports: winston.transport[]) {
  //     // Setting log levels for winston
  //     const levels: any = {};
  //     let cont = 0;
  //     Object.values(LogLevel).forEach((level) => {
  //       levels[level] = cont;
  //       cont++;
  //     });

  //     return {
  //       level: LogLevel.Debug,
  //       levels: levels,
  //       format: winston.format.combine(
  //         // Add timestamp and format the date
  //         winston.format.timestamp({
  //           format: 'DD/MM/YYYY, HH:mm:ss',
  //         }),
  //         // Errors will be logged with stack trace
  //         winston.format.errors({ stack: true }),
  //         // Add custom Log fields to the log
  //         winston.format((info, opts) => {
  //           // Info contains an Error property
  //           if (info.error && info.error instanceof Error) {
  //             info.stack = info.error.stack;
  //             info.error = undefined;
  //           }

  //           info.label = `${info.organization}.${info.context}.${info.app}`;

  //           return info;
  //         })(),
  //         // Add custom fields to the data property
  //         winston.format.metadata({
  //           key: 'data',
  //           fillExcept: ['timestamp', 'level', 'message'],
  //         }),
  //         // Format the log as JSON
  //         winston.format.json(),
  //       ),
  //       transports: transports,
  //       exceptionHandlers: transports,
  //       rejectionHandlers: transports,
  //     };
  //   }

  public log(level: LogLevel, message: string | Error, data?: LogData) {
    const logData = {
      level: level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    this.logger.info(logData);
  }

  public debug(message: string, data?: LogData) {
    this.log(LogLevel.Debug, message, data);
  }

  public info(message: string, data?: LogData) {
    this.log(LogLevel.Info, message, data);
  }

  public warn(message: string | Error, data?: LogData) {
    this.log(LogLevel.Warn, message, data);
  }

  public error(message: string | Error, data?: LogData) {
    this.log(LogLevel.Error, message, data);
  }

  public fatal(message: string | Error, data?: LogData) {
    this.log(LogLevel.Fatal, message, data);
  }

  public emergency(message: string | Error, data?: LogData) {
    this.log(LogLevel.Emergency, message, data);
  }
}
