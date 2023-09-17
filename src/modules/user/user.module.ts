import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { User, Role } from '@microservice-auth/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
