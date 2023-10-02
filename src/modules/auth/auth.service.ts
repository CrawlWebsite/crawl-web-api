import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from 'config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

import { CONFIG } from '@microservice-auth/module-config/config.provider';
import { PostgresErrorCode } from '@microservice-auth/module-database/postgresErrorCodes.enum';
import { UserService } from '@microservice-auth/module-user/user.service';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CONFIG) private readonly configService: IConfig,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.createUser({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtAccessToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwt_secret'),
      expiresIn: `${this.configService.get('auth.jwt_expiration_time')}s`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'auth.jwt_expiration_time',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public getCookieWithJwtRefreshToken(payload: TokenPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwt_refresh_token_secret'),
      expiresIn: `${this.configService.get(
        'auth.jwt_refresh_token_expiration_time',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'auth.jwt_refresh_token_expiration_time',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
