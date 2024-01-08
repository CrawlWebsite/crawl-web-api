import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto, PaginationResultDto } from '../dto/pagination.dto';

export interface IPagination {
  paginate(
    query: SelectQueryBuilder<any>,
    filter: PaginationDto,
  ): Promise<PaginationResultDto>;
}
