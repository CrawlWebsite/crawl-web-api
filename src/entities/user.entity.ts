import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';
import { CrawlProcess } from './crawlProcess.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    nullable: true,
  })
  public currentHashedRefreshToken?: string;

  @Column({
    default: false,
  })
  @Exclude()
  public isDeleted: boolean;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles', // table name for the junction table of this relation
    joinColumn: {
      name: 'users',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roles',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => CrawlProcess, (crawlProcess) => crawlProcess.owner)
  crawlProcesses: CrawlProcess[];
}
