import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const responseBody = {
          statusCode: res?.statusCode,
          timestamp: new Date().toISOString(),
          path: res?.req?.originalUrl,
          message: data,
        };
        return responseBody;
      }),
    );
  }
}
