import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import UpdateUserDto from './dto/updateUser.dto';
import GetUserDto from './dto/getUser.dto';
import CreateUserDto from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  // @UseGuards(JwtAuthGuard)
  async getUsers(@Query() queries: GetUserDto) {
    const users = this.userService.getUsers({ ...queries, isDeleted: false });
    return users;
  }

  @Get('/is-deleted')
  @ApiResponse({
    status: 200,
    description: 'Get user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Get user unsuccessfully',
  })
  // @UseGuards(JwtAuthGuard)
  async getDeletedUsers(@Query() queries: GetUserDto) {
    const users = this.userService.getUsers({ ...queries, isDeleted: true });
    return users;
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Create user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Create user unsuccessfully',
  })
  // @UseGuards(JwtAuthGuard)
  async createUser(@Body() data: CreateUserDto) {
    const users = this.userService.createUser(data);
    return users;
  }

  @Patch('/:userId')
  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Update user successfully',
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
    const updatedUser = await this.userService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }

  @Delete('/:userId/soft-delete')
  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Delete soft user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Delete soft user unsuccessfully',
  })
  async deleteSoftUser(@Req() request, @Param() params) {
    const { userId } = params;
    await this.userService.deleteUser(Number(userId), true);
    return true;
  }

  @Delete('/:userId')
  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Delete user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Delete user unsuccessfully',
  })
  async deleteUser(@Req() request, @Param() params) {
    const { userId } = params;
    await this.userService.deleteUser(Number(userId), false);
    return true;
  }

  @Patch('/:userId/restore')
  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Restore user successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Restore user unsuccessfully',
  })
  async restoreUser(@Req() request, @Param() params) {
    const { userId } = params;
    await this.userService.restoreUser(Number(userId));
    return true;
  }
}
