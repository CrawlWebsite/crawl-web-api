import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcService } from '@microservice-auth/module-gRPC/gRPC.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  private authService;

  constructor(
    private readonly appService: AppService,
    private readonly gRPCService: GrpcService,
  ) {
    this.authService = gRPCService.getService('AuthService');
  }

  @Get('')
  getHello(): string {
    this.authService.SayHello({ name: '1' });
    return this.appService.getHello();
  }

  @GrpcMethod('AuthService')
  sayHello(data: any): { message: string } {
    console.log('555', data);
    return { message: 'Hello, World!' };
  }
}
