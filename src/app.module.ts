import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@microservice-auth/module-database/database.module';
import { LoggerModule } from '@microservice-auth/module-log/logs.module';
import { AuthModule } from '@microservice-auth/module-auth/auth.module';
import { UserModule } from '@microservice-auth/module-user/user.module';

import { LoggerMiddleware } from '@microservice-auth/config-middlewares';
import { TransformInterceptor } from '@microservice-auth/config-interceptors';
import { HttpExceptionsFilter } from '@microservice-auth/config-exceptions';

import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
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
