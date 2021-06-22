import { ID, ObjectType, Field } from '@nestjs/graphql';
import {
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { config } from '../../shared/config';
import { RemindableEntity as Remindable } from './remindable.entity';
import { TeamEntity } from '../../teams/entities/team.entity';
import { TaskEntity } from '../../tasks/entities/task.entity';
@Entity('users')
@ObjectType()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column('text')
  @Field()
  name: string;
  @Column('boolean')
  @Field()
  email_verified: boolean;
  @Column('timestamp', { default: null })
  @Field()
  email_verified_at: Date;

  @Column('text', { unique: true })
  @Field()
  email: string;

  @Column('text')
  password: string;

  @OneToMany(() => Remindable, (remindable) => remindable.user)
  @Field(() => [Remindable], { defaultValue: [] })
  remindables: Remindable[];

  @OneToMany(() => TeamEntity, (team) => team.owner)
  @Field(() => [TeamEntity], { defaultValue: [] })
  teams: TeamEntity[];

  @OneToMany(() => TaskEntity, (task) => task.owner)
  @Field(() => [TaskEntity], { defaultValue: [] })
  tasks: TaskEntity[];

  @CreateDateColumn()
  @Field()
  created_at: Date;
  @UpdateDateColumn()
  @Field()
  updated_at: Date;
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }
  private get token() {
    const { id, name } = this;
    return sign({ id, name }, config.JWT_TOKEN, {
      expiresIn: config.JWT_TOKEN_EXPIRATION,
    });
  }
  toResponseObject(showToken: boolean = true) {
    const { id, created_at, name, email, token, updated_at, remindables } =
      this;
    let responseObject: any = {
      id,
      name,
      email,
      remindables,
      created_at,
      updated_at,
    };
    if (remindables) {
      responseObject.remindables = remindables;
    }
    // if (teams) {
    //   responseObject.teams = teams;
    // }
    if (showToken) {
      responseObject.auth_token = token;
    }
    return responseObject;
  }
}
