import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ContextType,
} from '@nestjs/common';

import { HttpInterceptor } from './http.interceptor';
import { GrpcInterceptor } from './grpc.interceptor';

class Interceptor {
  private readonly httpInterceptor: HttpInterceptor;
  private readonly grpcInterceptor: GrpcInterceptor;

  constructor() {
    this.httpInterceptor = new HttpInterceptor();
    this.grpcInterceptor = new GrpcInterceptor();
  }

  public getInterceptor(type: ContextType) {
    switch (type) {
      case 'http':
        return this.httpInterceptor;
      case 'rpc':
        return this.grpcInterceptor;
      default:
        return undefined;
    }
  }

  public excute(
    type: ContextType,
    context: ExecutionContext,
    next: CallHandler,
  ) {
    const interceptor = this.getInterceptor(type);

    return interceptor.intercept(context, next);
  }
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private interceptor: Interceptor;
  constructor() {
    this.interceptor = new Interceptor();
  }

  intercept(context: ExecutionContext, next: CallHandler): any {
    const type = context.getType();

    return this.interceptor.excute(type, context, next);
  }
}
