import * as dotenv from 'dotenv';
dotenv.config();

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { IConfig } from 'config';

import getLogLevels from '@crawl-web-api/utils/getLogLevels';

import { AllExceptionsFilter } from '@crawl-web-api/config-exceptions';
import { TransformInterceptor } from '@crawl-web-api/config-interceptors';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';

import { AppModule } from './app.module';
import NestjsLoggerServiceAdapter from '@crawl-web-api/module-log/nestjsLoggerServiceAdapter';

async function bootstrap() {
  // Logger
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  const configService = app.get<IConfig>(CONFIG);
  const loggerService = app.get(NestjsLoggerServiceAdapter);

  // const microservice = app.connectMicroservice<MicroserviceOptions>(
  //   {
  //     transport: Transport.KAFKA,
  //     options: {
  //       client: {
  //         clientId: configService.get<string>('kafka.kafka_client_id'),
  //         brokers: configService.get<string>('kafka.kafka_brokers').split(','),
  //       },
  //       consumer: {
  //         groupId: configService.get<string>('kafka.consumer_id'),
  //         sessionTimeout: 60000,
  //         heartbeatInterval: 40000,
  //         maxWaitTimeInMs: 30000,
  //         readUncommitted: true,
  //         retry: {
  //           initialRetryTime: 100, // 100 milliseconds - Initial retry delay
  //           maxRetryTime: 30000, // 30 seconds - Maximum retry delay
  //           retries: 10, // Number of retry attempts
  //         },
  //       },
  //     },
  //   },
  //   { inheritAppConfig: true },
  // );

  app.setGlobalPrefix(configService.get<string>('server.base_url'));

  app.useLogger(loggerService);

  app.enableCors({
    origin: configService.get<string>('server.cors_domains').split(','),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // microservice.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Catch exception
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(loggerService, httpAdapter));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<string>('server.port'));
}

bootstrap();
