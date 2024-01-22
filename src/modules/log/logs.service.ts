import { Injectable } from '@nestjs/common';

import { Log } from '@crawl-web-api/entities';

import { CreateLogDto } from './dto/createLog.dto';

@Injectable()
<<<<<<< Updated upstream:src/modules/log/logs.service.ts
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}
=======
export default class LoggerService {
  constructor() {
    return;
  }
>>>>>>> Stashed changes:src/modules/log/logger.service.ts

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
