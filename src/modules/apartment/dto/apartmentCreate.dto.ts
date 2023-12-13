import { IsString, IsOptional } from 'class-validator';

export class ApartmentAddressDto {
  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  project: string;
}

export class ApartmentInfoDto {
  @IsString()
  @IsOptional()
  acreage: string;

  @IsString()
  @IsOptional()
  acreageUnit: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  legal: string;

  @IsString()
  @IsOptional()
  legalStatus: string;

  @IsString()
  @IsOptional()
  apartmentFloor: string;

  @IsString()
  @IsOptional()
  numberOfBedRoom: string;

  @IsString()
  @IsOptional()
  numberOfToilet: string;

  @IsString()
  @IsOptional()
  numberOfFloor: string;

  @IsString()
  @IsOptional()
  pricePerSquareMeter: string;

  @IsString()
  @IsOptional()
  pricePerSquareMeterUnit: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  priceUnit: string;

  @IsString()
  @IsOptional()
  balconyDirection: string;

  @IsString()
  @IsOptional()
  apartmentDirection: string;

  @IsString()
  @IsOptional()
  interior: string;
}

export class ApartmentCreateDto {
  apartmentAddress: ApartmentAddressDto;
  apartmentInfo: ApartmentInfoDto;
}
