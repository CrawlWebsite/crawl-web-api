import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

// Entity
import { User, Role, Roles, CrawlProcess } from '@crawl-web-api/entities';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(CrawlProcess)
    private crawlProcessRepo: Repository<CrawlProcess>,
  ) {}

  async seed() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      // Delete all crawl process
      await this.crawlProcessRepo.delete({});
      // Delete all role
      await this.roleRepo.delete({});
      // Detele all user
      await this.userRepo.delete({});

      // Create new role
      const roleAdmin = new Role();
      roleAdmin.name = Roles.ADMIN;
      const roleMember = new Role();
      roleMember.name = Roles.MEMBER;
      const roleSystemAdmin = new Role();
      roleSystemAdmin.name = Roles.SYSTEMADMIN;

      await Promise.all([
        this.roleRepo.save(roleAdmin),
        this.roleRepo.save(roleMember),
        this.roleRepo.save(roleSystemAdmin),
      ]);
      this.logger.debug('Successfuly completed seeding roles...');

      // Create new user
      const users = [];
      const hashedPassword = await bcrypt.hash('123456', 10);

      const admin = new User();
      admin.name = faker.name.fullName();
      admin.email = 'admin@example.com';
      admin.roles = [roleAdmin];
      admin.password = hashedPassword;
      users.push(this.userRepo.save(admin));

      const member = new User();
      member.name = faker.name.fullName();
      member.email = 'member@example.com';
      member.roles = [roleMember];
      member.password = hashedPassword;
      users.push(this.userRepo.save(member));

      const systemAdmin = new User();
      systemAdmin.name = faker.name.fullName();
      systemAdmin.email = 'systemadmin@example.com';
      systemAdmin.roles = [roleSystemAdmin];
      systemAdmin.password = hashedPassword;
      users.push(this.userRepo.save(systemAdmin));

      await Promise.all(users);

      this.logger.debug(
        'Successfuly completed seeding users...',
        this.seedUsers.name,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(
        'Failed seeding users...',
        error.stack,
        this.seedUsers.name,
      );
    }
  }
}
