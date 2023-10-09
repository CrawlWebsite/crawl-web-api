import { GrpcService } from '@microservice-auth/module-gRPC/gRPC.service';
import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { CreateUserGrpcRequestDto, CreateUserGrpcResponseDto } from './dto';

@Injectable()
export class UserGrpcService extends GrpcService {
  constructor(@Inject('GRPC_CLIENT') client: ClientGrpcProxy) {
    super(client, 'UserService');
  }

  async getUserByEmail(args: any) {
    const result = await this.execute('getUserByEmail', args);

    return result;
  }

  async createUser(
    data: CreateUserGrpcRequestDto,
  ): Promise<CreateUserGrpcResponseDto> {
    return (await this.execute(
      'createUser',
      data,
    )) as CreateUserGrpcResponseDto;
  }
}
