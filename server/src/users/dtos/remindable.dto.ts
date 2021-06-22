import { ObjectID } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { RemindableEntity } from '../entities/remindable.entity';

@ObjectType()
export class RemindableDTO extends RemindableEntity {}

export interface AuthToken {
  id: ObjectID;
}
