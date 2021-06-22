import { ObjectType } from '@nestjs/graphql';
import { TaskEntity } from '../entities/task.entity';

@ObjectType()
export class TaskDTO extends TaskEntity {}
