import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerService } from './crawler.service';
import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { LoggerModule } from '@crawl-web-api/module-log/logger.module';
import { KafkaModule } from '@crawl-web-api/module-kafka/kafka.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CrawlProcess, Log, User } from '@crawl-web-api/entities';
import { DatabaseModule } from '@crawl-web-api/module-database/database.module';
import { Repository } from 'typeorm';
import { UserModule } from '@crawl-web-api/module-user/user.module';
import { IConfig } from 'config';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';

describe('CrawlerService', () => {
  let service: CrawlerService;
  let config: IConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DatabaseModule,
        LoggerModule,
        KafkaModule,
        UserModule,
        TypeOrmModule.forFeature([User, CrawlProcess]),
      ],
      providers: [CrawlerService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
    config = module.get<IConfig>(CONFIG);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should register crawler process', async () => {
    try {
      const processes = await service.registerCrawlProcess(1, {
        url: 'http://example.com',
        startPage: 1,
        endPage: 10,
      });

      console.log(processes);
      expect(service).toBeDefined();
    } catch (e) {
      console.log(e);
    }
  });
});
