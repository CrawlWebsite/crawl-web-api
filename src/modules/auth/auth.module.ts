import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IConfig } from 'config';

import { CONFIG } from '@crawl-web-api/module-config/config.provider';

import { ConfigModule } from '@crawl-web-api/module-config/config.module';
import { UserModule } from '@crawl-web-api/module-user/user.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './guard/jwt.strategy';
import { LoggerModule } from '@crawl-web-api/module-log/logger.module';

@Module({
  imports: [
    LoggerModule,
    PassportModule,
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: async (configService: IConfig) => ({
        secret: configService.get('auth.jwt_secret'),
        signOptions: {
          expiresIn: `${configService.get('auth.jwt_expiration_time')}s`,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
