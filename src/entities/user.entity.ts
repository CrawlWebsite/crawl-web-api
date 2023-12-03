import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column({
    nullable: true,
  })
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
