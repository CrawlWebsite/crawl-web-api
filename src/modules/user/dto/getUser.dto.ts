import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

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
  @Min(1)
  @ApiProperty({
    name: 'page',
    required: false,
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({
    name: 'perPage',
    required: false,
  })
  perPage: number;

  isDeleted: boolean;
}

export default GetUserDto;
