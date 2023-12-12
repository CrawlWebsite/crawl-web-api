import { Apartment, Publisher, Sale } from '@crawl-web-api/entities';
import { IsString, IsOptional } from 'class-validator';

export class ApartmentSaleCreateDto {
  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  publisher: Publisher;

  apartment: Apartment;

  sale: Sale;
}
