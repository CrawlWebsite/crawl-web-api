import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @ApiProperty()
  public email: string;

  @Column()
  @ApiProperty()
  public name: string;

  @Column({ unique: true })
  @ApiProperty()
  public code: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

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
}
