import { ID, ObjectType, Field } from '@nestjs/graphql';
import {
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import * as pg from 'pg';
pg.defaults.parseInputDatesAsUTC = true;
pg.types.setTypeParser(
  1114,
  (stringValue: string) => new Date(`${stringValue}Z`),
);
import { UserEntity as User } from './user.entity';
@Entity('remindables')
@ObjectType()
export class RemindableEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column('text')
  type: string;

  @Column('text')
  token: string;

  @Column('boolean')
  @Field()
  is_expired: boolean;

  @ManyToOne(() => User, (user) => user.remindables)
  @Field(() => User)
  user: User;

  @Column('boolean')
  @Field()
  is_used: boolean;

  @Column('timestamp', {})
  @Field()
  expires_at: Date;

  @CreateDateColumn()
  @Field()
  created_at: Date;
  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
