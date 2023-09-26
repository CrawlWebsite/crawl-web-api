import { Response } from 'express';
import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  Get,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IConfig } from 'config';

// Service
import { UserService } from '@microservice-auth/module-user/user.service';
import { CONFIG } from '@microservice-auth/module-config/config.provider';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';
import LoginDto from './dto/login.dto';

// Guard
import { JwtAuthGuard } from './guard/jwtAuth.guard';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';

// Entity
import { User } from '@microservice-auth/entities';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CONFIG) private readonly configService: IConfig,
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
    const accessTokenData = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenData = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );

    await this.usersService.setCurrentRefreshToken(
      refreshTokenData.token,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenData.cookie,
      refreshTokenData.cookie,
    ]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  async verifyToken(@Req() request, @Res() response) {
    const { id, email, name } = request.user;

    request.res.setHeader(
      'jwt_user_claim',
      JSON.stringify({
        id,
        email,
        name,
      }),
    );
    response.sendStatus(200);
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
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
    return user;
  }
}
