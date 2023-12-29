import { IsString, IsInt, IsOptional } from 'class-validator';

export class RegisterCrawlerProcessDto {
  @IsString()
  url: string;

  @IsInt()
  @IsOptional()
  startPage: number;

  @IsInt()
  @IsOptional()
  endPage: number;
}

export default RegisterCrawlerProcessDto;
