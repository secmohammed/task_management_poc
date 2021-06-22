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

@Entity('teams')
@ObjectType()
export class TeamEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column('text')
  @Field()
  name: string;
  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  @Field(() => [User])
  members: User[];

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User, (user) => user.teams)
  @Field(() => User)
  owner: User;
  @CreateDateColumn()
  @Field()
  created_at: Date;
  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
