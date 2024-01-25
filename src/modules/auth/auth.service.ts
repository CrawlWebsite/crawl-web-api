import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from 'config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { UserService } from '@crawl-web-api/module-user/user.service';

import { RegisterDto } from './dto/register.dto';
import { CustomLogger } from '@crawl-web-api/module-log/customLogger';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly logger: CustomLogger,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const createdUser = await this.usersService.createUser({
      ...registrationData,
      password: hashedPassword,
    });
    return createdUser;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      this.logger.info('User verified');

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
