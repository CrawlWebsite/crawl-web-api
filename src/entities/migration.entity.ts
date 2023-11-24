import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum Roles {
  ADMIN = 'admin',
  MEMBER = 'member',
  SYSTEMADMIN = 'systemadmin',
}

@Entity('migrations')
export class Migration extends BaseEntity {
  @Column({
    type: 'bigint',
  })
  public timestamp: number;

  @Column()
  public name: string;
}
