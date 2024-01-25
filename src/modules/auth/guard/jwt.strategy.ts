import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { IConfig } from 'config';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { UserService } from '@crawl-web-api/module-user/user.service';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('auth.jwt_secret'),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getById(payload.userId);
  }
}
