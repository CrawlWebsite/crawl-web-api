import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsNumber } from 'class-validator';

export class GetUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    name: 'email',
    required: false,
  })
  email: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    name: 'page',
    required: false,
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    name: 'perPage',
    required: false,
  })
  perPage: number;

  isDeleted: boolean;
}

export default GetUserDto;
