import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { UserEntity as User } from '../../users/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
export enum Status {
  Open = 'open',
  Closed = 'closed',
  Pending = 'pending',
}
@Entity('tasks')
@ObjectType()
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field()
  title: string;

  @Column('text', { nullable: true })
  @Field()
  description: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  @Field(() => [User])
  assignees: User[];
  @Column('uuid')
  ownerId: string;
  @Column('text')
  @Field()
  status: Status;
  @ManyToOne(() => User, (user) => user.tasks)
  @Field(() => User)
  owner: User;
  @CreateDateColumn()
  @Field()
  created_at: Date;
  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
