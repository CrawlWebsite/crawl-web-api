import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { IPagination } from './interfaces/pagination.interface';

export class Pagination implements IPagination {
  private static instance: Pagination;

  public static getInstance(): Pagination {
    if (!Pagination.instance) {
      Pagination.instance = new Pagination();
    }

    return Pagination.instance;
  }

  async paginate<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    filter: PaginationDto,
  ) {
    let { page, pageSize } = filter;
    if (!page) page = 1;
    if (!pageSize) pageSize = 30;

    query.skip((page - 1) * pageSize);
    query.take(pageSize);

    const [records, totalCount] = await query.getManyAndCount();
    const totalPage = Math.ceil(totalCount / pageSize);

    return {
      records,
      metadata: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPage,
      },
    };
  }
}
