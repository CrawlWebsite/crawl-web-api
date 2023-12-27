import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum CrawlProcessStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('crawl-processes')
export class CrawlProcess extends BaseEntity {
  @Column()
  public url: string;

  @Column({ nullable: true })
  public startPage: number;

  @Column({ nullable: true })
  public endPage: number;

  @Column({ default: 0 })
  public progress: number;

  @Column({
    type: 'enum',
    enum: CrawlProcessStatus,
    default: CrawlProcessStatus.CREATED,
  })
  public status: string;

  @Column({ nullable: true })
  public startedAt: Date;

  @Column({ nullable: true })
  public completedAt: Date;

  @Column({ nullable: true })
  public cancelledAt: Date;

  @ManyToOne(() => User, (user) => user.crawlProcesses)
  owner: User;
}
