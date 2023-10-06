import {
  OnModuleDestroy,
  OnModuleInit,
  Injectable,
  Inject,
} from '@nestjs/common';
import { IConfig } from 'config';
import { ClientGrpcProxy } from '@nestjs/microservices';

import { CONFIG } from '@microservice-auth/module-config/config.provider';
import { join } from 'path';

@Injectable()
export class GrpcService implements OnModuleInit, OnModuleDestroy {
  private client: ClientGrpcProxy;

  constructor(@Inject(CONFIG) private readonly configService: IConfig) {
    this.setUpGrpcClient();
  }

  private setUpGrpcClient() {
    this.client = new ClientGrpcProxy({
      package: 'auth',
      protoPath: 'src/proto/auth.proto',
      url: this.configService.get('server.grpc_hostname'),
    });
  }

  getGrpcClient(): ClientGrpcProxy {
    return this.client;
  }

  async onModuleInit() {
    // await this.client.connect();
  }

  async onModuleDestroy() {
    this.client.close();
  }

  getService(serviceName: string) {
    const service = this.client.getService(serviceName);

    return service;
  }
}
