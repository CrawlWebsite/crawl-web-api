import { Injectable } from '@nestjs/common';

import CustomLogger from '@crawl-web-api/module-log/customLogger';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from '@crawl-web-api/entities';
import { Repository } from 'typeorm';
import { toNumberOrNull } from '@crawl-web-api/utils/number';
import { PublisherCreateDto } from './dto/publisherCreate.dto';

@Injectable()
export class PublisherService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Publisher)
    private publisherRepository: Repository<Publisher>,
  ) {
    this.logger.setContext(PublisherService.name);
  }

  async createPublisher(data: PublisherCreateDto) {
    const { hostname } = data;

    if (!hostname) {
      this.logger.error(
        'Publisher hostname is required',
        'Create Publisher',
        this.createPublisher.name,
      );
      return;
    }

    await this.publisherRepository.upsert(data, {
      conflictPaths: ['hostname'],
      skipUpdateIfNoValuesChanged: true,
    });

    const publisher = await this.publisherRepository.findOne({
      where: { hostname },
    });

    return publisher;
  }
}
