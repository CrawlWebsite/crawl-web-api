import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { CrawlerService } from './crawler.service';
import { KafkaService } from '@crawl-web-api/module-kafka/kafka.service';
import { KAFKA_TOPIC_PRODUCER } from '@crawl-web-api/module-kafka/dto';
import CrawlRegisterDto from './dto/crawlRegister.dto';

@Controller('crawler')
@ApiTags('crawler')
export class CrawlerController {
  constructor(
    private readonly crawlerService: CrawlerService,
    private readonly kafkaService: KafkaService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  @Post('/')
  async crawlRegister() {
    // const { url, startPage, endPage } = data;
    // console.log(data);
    // this.kafkaService.sendKafkaMessageWithoutKey(
    //   KAFKA_TOPIC_PRODUCER.WEBSITE_CRAWL_REGISTER,
    //   {
    //     url,
    //     startPage,
    //     endPage,
    //   },
    // );

    this.kafkaService.sendKafkaMessageWithoutKey('website.crawl.data' as any, {
      apartmentAddress: {
        city: 'city',
        district: 'district',
        address: 'address',
        project: 'project',
      },
      apartmentInfo: {
        acreage: '100',
        acreageUnit: 'm',
        type: 'c',
        legal: 'd',
        legalStatus: 'deep',
        apartmentFloor: '2',
        numberOfBedRoom: '2',
        numberOfToilet: '7',
        pricePerSquareMeter: '37',
        pricePerSquareMeterUnit: 'm',
        price: '2',
        priceUnit: 'ty',
      },
      sale: {
        name: 'sale1',
        phoneNumber: '123465',
      },
      salePost: {
        url: 'http',
        startDate: '2020-3',
        endDate: '2020-3',
        publisher: 'batdon',
      },
    });

    return;
  }
}
