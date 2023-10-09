import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Roles } from '@microservice-auth/entities';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: string[];
}

export default RegisterDto;
