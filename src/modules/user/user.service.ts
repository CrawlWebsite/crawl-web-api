import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

import { Role, Roles, User } from '@crawl-web-api/entities';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async createUser(userData: CreateUserDto) {
    const { email, name, password, roles } = userData;

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password;

    let roleEntities = [];
    if (roles?.length > 0) {
      roleEntities = await this.roleRepository.find({
        where: {
          name: In(roles),
        },
      });
    } else {
      const role = await this.roleRepository.find({
        where: {
          name: Roles.MEMBER,
        },
      });
      roleEntities.push(role);
    }

    newUser.roles = roleEntities;

    console.log(newUser);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    let user = await this.getById(userId);

    await this.usersRepository.update(
      {
        id: userId,
      },
      {},
    );
    user = await this.getById(userId);

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
