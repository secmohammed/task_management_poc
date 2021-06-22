import { ObjectID } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { TeamEntity } from '../entities/team.entity';

@ObjectType()
export class TeamDTO extends TeamEntity {}
