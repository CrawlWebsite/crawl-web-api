import { Injectable } from '@nestjs/common';

import { Log } from '@crawl-web-api/entities';

import { CreateLogDto } from './dto/createLog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class LoggerService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}
  async createLog(log: CreateLogDto) {
    // const newLog = this.logsRepository.create(log);
    // await this.logsRepository.save(newLog, {
    //   data: {
    //     isCreatingLogs: true,
    //   },
    // });
    // return newLog;
  }
}
