import { Controller, UseGuards } from '@nestjs/common';

import { GrpcMethod, RpcException } from '@nestjs/microservices';
import CustomLogger from '@microservice-auth/module-log/customLogger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard';

@Controller()
export class AuthGrpcController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly authService: AuthService,
  ) {
    logger.setContext(AuthGrpcController.name);
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService')
  async authenticate() {
    console.log('abc');
  }
}
