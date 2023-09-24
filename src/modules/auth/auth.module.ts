import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { IConfig } from 'config';

import { CONFIG } from '@microservice-auth/module-config/config.provider';

import { ConfigModule } from '@microservice-auth/module-config/config.module';
import { UserModule } from '@microservice-auth/module-user/user.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
