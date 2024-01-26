import { Response } from 'express';
import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  Res,
  Get,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { UserService } from '@crawl-web-api/module-user/user.service';
import { CONFIG } from '@crawl-web-api/module-config/config.provider';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';
import LoginDto from './dto/login.dto';

// Guard
import { JwtAuthGuard } from './guard/jwtAuth.guard';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';

// Entity
import { User } from '@crawl-web-api/entities';
import { CustomLogger } from '@crawl-web-api/module-log/customLogger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    @Inject(CONFIG) private readonly configService: IConfig,
    private readonly logger: CustomLogger,
  ) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Register successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Register unsuccessfully',
  })
  async register(@Body() registrationData: RegisterDto) {
    const user = await this.authService.register(registrationData);

    return user;
  }

  @HttpCode(200)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Login unsuccessfully',
  })
  async logIn(@Req() request, @Body() loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.authService.getAuthenticatedUser(email, password);
    const accessTokenData = this.authService.getCookieWithJwtAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshTokenData = this.authService.getCookieWithJwtRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await this.usersService.setCurrentRefreshToken(
      refreshTokenData.token,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenData.cookie,
      refreshTokenData.cookie,
    ]);

    this.logger.info('Login successful');

    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Logout unsuccessfully',
  })
  async logOut(@Req() request, @Res() response: Response) {
    const { user } = request;
    await this.usersService.removeRefreshToken(user.id);

    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiResponse({
    status: 200,
    description: 'Refresh token successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Refresh token unsuccessfully',
  })
  refresh(@Req() request) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken({
      userId: user.id,
      email: user.email,
    });

    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return user;
  }
}
