import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
  SYSTEMADMIN = 'systemadmin',
}

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.MEMBER,
    unique: true,
  })
  public name: string;
}
