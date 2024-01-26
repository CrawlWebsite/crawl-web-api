import { Roles } from '@crawl-web-api/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsObject,
  ValidateNested,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty({
    name: 'email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
  })
  name: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  @ApiProperty({
    name: 'roles',
    default: ['admin'],
    enum: ['systemadmin', 'admin', 'member'] as Roles[],
  })
  roles: string[];
}

export default UpdateUserDto;
