import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@crawl-web-api/module-database/database.module';
import { LoggerModule } from '@crawl-web-api/module-log/logs.module';
import { AuthModule } from '@crawl-web-api/module-auth/auth.module';
import { UserModule } from '@crawl-web-api/module-user/user.module';

import { LoggerMiddleware } from '@crawl-web-api/config-middlewares';
import { TransformInterceptor } from '@crawl-web-api/config-interceptors';
import { AllExceptionsFilter } from '@crawl-web-api/config-exceptions';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [LoggerModule, ConfigModule, DatabaseModule, AuthModule, UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
