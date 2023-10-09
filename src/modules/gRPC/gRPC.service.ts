import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcService {
  constructor(
    protected readonly client: ClientGrpcProxy,
    protected readonly serviceName: string,
  ) {}

  protected async execute(methodName: string, args: any) {
    try {
      const service = this.client.getService(this.serviceName);
      const result: any = await lastValueFrom(service[methodName](args));

      return result?.message;
    } catch (err) {
      const error = new HttpException(err, HttpStatus.BAD_REQUEST);
      throw error;
    }
  }
}
