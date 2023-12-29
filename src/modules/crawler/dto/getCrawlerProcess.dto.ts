import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class GetCrawlerProcessByUserDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  url: string[];
}

export class GetCrawlerProcessByAdminDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  url: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userId: number[];
}
