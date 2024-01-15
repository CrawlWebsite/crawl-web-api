import { Module } from '@nestjs/common';
import { v4 } from 'uuid';
import { ClsModule } from 'nestjs-cls';
import {
  CLS_KEYS,
  LocalStorageServiceKey,
} from './interfaces/localStorageService';
import NestjsClsStorageService from './nestjsClsStorage.service';
import { REQ_HEADER_KEY } from '@crawl-web-api/module-auth/interfaces/tokenPayload.interface';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) =>
          req.headers[REQ_HEADER_KEY.CORRELATION_ID] ?? v4(),
        setup: (cls, req: Request) => {
          cls.set(CLS_KEYS.USER_ID, req.headers[REQ_HEADER_KEY.USER_ID]);
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: LocalStorageServiceKey,
      useClass: NestjsClsStorageService,
    },
  ],
  exports: [LocalStorageServiceKey],
})
export class LocalStorageModule {}
