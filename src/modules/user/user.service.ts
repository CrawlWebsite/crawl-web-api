import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

import { BaseService } from '@crawl-web-api/module-base/base.service';

import { Role, Roles, User } from '@crawl-web-api/entities';

import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import GetUserDto from './dto/getUser.dto';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super();
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
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

  async getById(
    id: number,
    options?: { relations?: string[]; ignoreRelations?: boolean },
  ) {
    const { relations, ignoreRelations } = options || {};

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ignoreRelations ? [] : relations ?? ['roles'],
    });

    return user;
  }

  public async getUsers(queries: GetUserDto) {
    const { email, isDeleted = false, page, pageSize } = queries;

    const getUserQuery = this.userRepository.createQueryBuilder('user');

    if (email) {
      getUserQuery.where({
        email,
      });
    }

    getUserQuery.andWhere({
      isDeleted,
    });

    const results = this.pagination.paginate(getUserQuery, {
      page,
      pageSize,
    });

    return results;
  }

  public async createUser(userData: CreateUserDto) {
    const { email, name, password, roles } = userData;

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = password;

    let roleEntities = [];
    if (roles.length > 0) {
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

    await this.userRepository.save(newUser);
    return newUser;
  }

  public async updateUserById(userId: number, userData: UpdateUserDto) {
    const user = await this.getById(userId);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const roleEntities = await this.roleRepository.find({
      where: {
        name: In(userData.roles),
      },
    });

    this.userRepository.merge(user, { ...userData, roles: roleEntities });
    await this.userRepository.save(user);

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
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
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async deleteUser(userId: number, isSoftDelete = true) {
    const user = await this.getById(userId);

    if (!user) {
      throw {
        message: 'User not found',
      };
    }

    if (isSoftDelete) {
      user.isDeleted = true;

      await this.userRepository.save(user);
    } else {
      await this.userRepository.remove(user);
    }

    return true;
  }

  async restoreUser(userId: number) {
    const user = await this.getById(userId);

    if (!user) {
      throw {
        message: 'User not found',
      };
    }

    if (!user.isDeleted) {
      throw {
        message: 'User is not deleted',
      };
    }

    user.isDeleted = false;
    await this.userRepository.save(user);

    return true;
  }
}
