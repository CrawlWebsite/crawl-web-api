import { IsString, IsOptional } from 'class-validator';

export class PublisherCreateDto {
  @IsString()
  @IsOptional()
  hostname: string;
}
