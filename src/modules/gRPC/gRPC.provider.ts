import { CONFIG } from '@microservice-auth/module-config/config.provider';
import { Provider } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IConfig } from 'config';

export const GRPC_CLIENT = 'GRPC_CLIENT';

export const GrpcProvider: Provider = {
  provide: GRPC_CLIENT,
  useFactory: (configService: IConfig) => {
    const grpcHost = configService.get<string>('server.grpc_gateway_hostname');
    const client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: ['user'], // Replace with your actual package name
        protoPath: 'dist/proto/producer.proto', // Path to your .proto file
        url: grpcHost,
      },
    });

    return client; // Replace with your actual service name
  },
  inject: [CONFIG],
};
