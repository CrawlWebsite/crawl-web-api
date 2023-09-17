import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@microservice-auth/module-auth/guard';

import { User } from '@microservice-auth/entities';

import UpdateUserDto from './dto/updateUser.dto';

import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Query() queries) {
    const { email } = queries;
    const users = this.usersService.getByEmail(email);
    return users;
  }

  @Patch('/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Update user unsuccessfully',
  })
  async updateUserById(
    @Req() request,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = params;
    const updatedUser = await this.usersService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }
}
