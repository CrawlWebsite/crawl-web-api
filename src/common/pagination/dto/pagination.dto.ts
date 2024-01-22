import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public pageSize?: number;
}

export class PaginationResultDto {
  public records: any[];

  public metadata: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPage: number;
  };
}
