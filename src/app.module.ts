import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@crawl-web-api/module-database/database.module';
import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { AuthModule } from '@crawl-web-api/module-auth/auth.module';
import { UserModule } from '@crawl-web-api/module-user/user.module';

import { LoggerMiddleware } from '@crawl-web-api/config-middlewares';
import { AllExceptionsFilter } from '@crawl-web-api/config-exceptions';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebPageModule } from '@crawl-web-api/module-web-page/webPage.module';
import { CrawlerModule } from '@crawl-web-api/module-crawler/crawler.module';
import { SaleModule } from '@crawl-web-api/module-sale/sale.module';
import { ApartmentModule } from '@crawl-web-api/module-apartment/apartment.module';
import { ApartmentSaleModule } from '@crawl-web-api/module-apartment-sale/apartmentSale.module';
import { LocalStorageModule } from '@crawl-web-api/module-local-storage/localStorage.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    LocalStorageModule,
    LoggerModule,
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    WebPageModule,
    CrawlerModule,
    SaleModule,
    ApartmentModule,
    ApartmentSaleModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
