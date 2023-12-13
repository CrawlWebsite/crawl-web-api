import { IsString, IsOptional } from 'class-validator';

export class SaleCreateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
