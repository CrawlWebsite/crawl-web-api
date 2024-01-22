import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IConfig } from 'config';

import { BaseService } from '@crawl-web-api/module-base/base.service';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';
import { UserService } from '@crawl-web-api/module-user/user.service';

import { User, CrawlProcess } from '@crawl-web-api/entities';

import RegisterCrawlProcessDto from './dto/registerCrawlerProcess.dto';
import {
  GetCrawlProcessService,
  GetSubCrawlProcessService,
} from './dto/getCrawlerProcess.dto';

@Injectable()
export class CrawlerService extends BaseService {
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
    super();
    this.logger.setContext(CrawlerService.name);
  }

  async getCrawlProcesses(data: GetCrawlProcessService) {
    const { urls, userIds, page, pageSize } = data;

    const getCrawlProcessesQuery =
      this.crawlProcessRepository.createQueryBuilder('crawlProcess');

    if (urls?.length > 0) {
      getCrawlProcessesQuery.andWhere({
        url: In(urls),
      });
    }

    if (userIds?.length > 0) {
      getCrawlProcessesQuery.andWhere({
        owner: In(userIds),
      });
    }

    getCrawlProcessesQuery.andWhere('crawlProcess.mainProcess IS NULL');

    getCrawlProcessesQuery.leftJoinAndSelect('crawlProcess.owner', 'users');

    const results = this.pagination.paginate(getCrawlProcessesQuery, {
      page,
      pageSize,
    });

    return results;
  }

  async getSubCrawlProcesses(
    mainProcessId: number,
    queries: GetSubCrawlProcessService,
  ) {
    const { page, pageSize, userIds } = queries;

    console.log(mainProcessId, { queries });
    const mainProcess = await this.getCrawlProcessById(mainProcessId);

    if (!mainProcess) {
      throw {
        message: 'CrawlProcess does not exist',
      };
    }

    const getCrawlProcessesQuery =
      this.crawlProcessRepository.createQueryBuilder('crawlProcess');

    getCrawlProcessesQuery.andWhere({
      mainProcess: mainProcessId,
    });

    if (userIds?.length > 0) {
      getCrawlProcessesQuery.andWhere({
        owner: In(userIds),
      });
    }

    getCrawlProcessesQuery.leftJoinAndSelect('crawlProcess.owner', 'users');

    const subProcessPaginateResult = await this.pagination.paginate(
      getCrawlProcessesQuery,
      {
        page,
        pageSize,
      },
    );

    return {
      mainProcess,
      subProcesses: subProcessPaginateResult,
    };
  }

  async getCrawlProcessById(
    id: number,
    options?: { relations?: string[]; ignoreRelations?: boolean },
  ) {
    const { relations, ignoreRelations } = options || {};

    const crawlProcess = await this.crawlProcessRepository.findOne({
      where: { id },
      relations: ignoreRelations ? [] : relations ?? ['owner'],
    });

    return crawlProcess;
  }

  async registerCrawlProcess(ownerId: number, data: RegisterCrawlProcessDto) {
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

    // this.kafkaService.sendKafkaMessageWithoutKey(
    //   KAFKA_TOPIC_PRODUCER.WEBSITE_CRAWL_REGISTER,
    //   {
    //     url,
    //     startPage,
    //     endPage,
    //   },
    // );

    return newCrawlProcess;
  }
}
