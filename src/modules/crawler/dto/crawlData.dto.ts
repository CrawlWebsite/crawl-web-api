import { ApartmentSaleCreateDto } from '@crawl-web-api/module-apartment-sale/dto/apartmentSaleCreate.dto';
import {
  ApartmentAddressDto,
  ApartmentInfoDto,
} from '@crawl-web-api/module-apartment/dto/apartmentCreate.dto';
import { PublisherCreateDto } from '@crawl-web-api/module-publisher/dto/publisherCreate.dto';
import { SaleCreateDto } from '@crawl-web-api/module-sale/dto/saleCreate.dto';

export class CrawlApartmentDataDto {
  apartmentAddress: ApartmentAddressDto;
  apartmentInfo: ApartmentInfoDto;
  sale: SaleCreateDto;
  apartmentSale: ApartmentSaleCreateDto;
  publisher: PublisherCreateDto;
}
