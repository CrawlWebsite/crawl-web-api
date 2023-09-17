import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Roles } from '@microservice-auth/entities';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsEnum(Roles, { each: true })
  roles: string[];
}

export default CreateUserDto;
