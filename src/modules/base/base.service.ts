import { IPagination, Pagination } from '@crawl-web-api/common/pagination';
import { IBaseService } from './interfaces/base.service.interface';

export class BaseService implements IBaseService {
  protected pagination: IPagination;

  constructor() {
    this.pagination = Pagination.getInstance();
  }
}
