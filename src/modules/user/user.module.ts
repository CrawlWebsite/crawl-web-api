import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Role, User } from '@crawl-web-api/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
