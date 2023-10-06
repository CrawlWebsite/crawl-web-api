import { Module } from '@nestjs/common';
import { ConfigModule } from '@microservice-auth/module-config/config.module';
import { GrpcService } from './gRPC.service';

@Module({
  imports: [ConfigModule],
  providers: [GrpcService],
  exports: [GrpcService],
})
export class GrpcModule {}
