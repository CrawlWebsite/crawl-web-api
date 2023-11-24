import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class GrpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const responseBody = {
          timestamp: new Date().toISOString(),
          constructorRef: context.getClass().name,
          handler: context.getHandler().name,
          message: data,
        };
        return responseBody;
      }),
    );
  }
}
