import * as dotenv from 'dotenv';
dotenv.config();

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { IConfig } from 'config';

import CustomLogger from '@microservice-auth/module-log/customLogger';

import getLogLevels from '@microservice-auth/utils/getLogLevels';

import { HttpExceptionsFilter } from '@microservice-auth/config-exceptions';
import { TransformInterceptor } from '@microservice-auth/config-interceptors';
import { CONFIG } from '@microservice-auth/module-config/config.provider';

import { AppModule } from './app.module';

async function bootstrap() {
  // Logger
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  const configService = app.get<IConfig>(CONFIG);

  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>('kafka.kafka_client_id'),
          brokers: configService.get<string>('kafka.kafka_brokers').split(','),
        },
        consumer: {
          groupId: configService.get<string>('kafka.consumer_id'),
        },
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: 'src/proto/auth.proto',
      url: configService.get<string>('server.grpc_hostname'),
    },
  });

  app.setGlobalPrefix(configService.get<string>('server.base_url'));

  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  microservice.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Catch exception
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionsFilter(httpAdapter));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('server.port'));
}

bootstrap();
