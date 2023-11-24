import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';

import { User, Role } from '@crawl-web-api/entities';
import { GrpcModule } from '@crawl-web-api/module-gRPC/gRPC.module';
import { UserGrpcService } from './user.grpc.service';

@Module({
  imports: [GrpcModule, TypeOrmModule.forFeature([User, Role])],
  providers: [UserService, UserGrpcService],
  exports: [UserService, UserGrpcService],
})
export class UserModule {}
