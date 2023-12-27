import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IConfig } from 'config';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';
import { UserService } from '@crawl-web-api/module-user/user.service';

import { User, CrawlProcess } from '@crawl-web-api/entities';

import CrawlRegisterDto from './dto/crawlRegister.dto';

@Injectable()
export class CrawlerService {
  constructor(
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly kafkaService: KafkaService,
    private readonly logger: CustomLogger,
    private readonly userService: UserService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(CrawlProcess)
    private crawlProcessRepository: Repository<CrawlProcess>,
  ) {
    this.logger.setContext(CrawlerService.name);
  }

  async registerCrawler(ownerId: number, data: CrawlRegisterDto) {
    const { url, startPage, endPage } = data;

    const owner = await this.userService.getById(ownerId, {
      ignoreRelations: true,
    });

    if (!owner) {
      throw {
        message: 'Crawl owner does not exist',
      };
    }

    const newCrawlProcess = new CrawlProcess();
    newCrawlProcess.url = url;
    newCrawlProcess.startPage = startPage;
    newCrawlProcess.endPage = endPage;
    newCrawlProcess.owner = owner;

    await this.crawlProcessRepository.save(newCrawlProcess);

    this.kafkaService.sendKafkaMessageWithoutKey(
      KAFKA_TOPIC_PRODUCER.WEBSITE_CRAWL_REGISTER,
      {
        url,
        startPage,
        endPage,
      },
    );

    return newCrawlProcess;
  }
}
