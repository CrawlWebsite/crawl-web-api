import {
  ApartmentAddressDto,
  ApartmentInfoDto,
} from '@crawl-web-api/module-apartment/dto/apartmentCreate.dto';
import { SaleCreateDto } from '@crawl-web-api/module-sale/dto/saleCreate.dto';
import { IsString, IsOptional } from 'class-validator';

export class SalePostDto {
  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  publisher: string;
}

export class CrawlApartmentDataDto {
  apartmentAddress: ApartmentAddressDto;
  apartmentInfo: ApartmentInfoDto;
  sale: SaleCreateDto;
  salePost: SalePostDto;
}
