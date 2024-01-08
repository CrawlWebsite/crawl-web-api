import { PaginationDto } from '@crawl-web-api/common/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class GetCrawlProcessByUserDto extends PaginationDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    name: 'urls',
  })
  urls: string[];
}

export class GetCrawlProcessByAdminDto extends PaginationDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    name: 'urls',
  })
  urls: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    name: 'userIds',
  })
  userIds: number[];
}

export class GetCrawlProcessService extends PaginationDto {
  urls?: string[];
  userIds?: number[];
}

export class GetSubCrawlProcessByAdminDto extends PaginationDto {}

export class GetSubCrawlProcessService extends PaginationDto {
  userIds?: number[];
}
