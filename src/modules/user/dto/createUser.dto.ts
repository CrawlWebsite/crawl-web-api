import { Roles } from '@crawl-web-api/entities';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    name: 'email',
    default: 'test@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    default: 'Test',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    name: 'password',
    default: 'password',
  })
  password: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  @ApiProperty({
    name: 'roles',
    default: ['admin'],
    enum: ['systemadmin', 'admin', 'member'] as Roles[],
  })
  roles: string[];
}

export default CreateUserDto;
