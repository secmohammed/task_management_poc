import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigneesResolver } from './resolvers/assignees.resolver';
import { AssigneeService } from './services/assignee.service';
import { TaskEntity } from './entities/task.entity';
import { TaskResolver } from './resolvers/tasks.resolver';
import { TaskService } from './services/task.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/user.service';
import { BullModule } from '@nestjs/bull';
import { RemindableEntity } from '../users/entities/remindable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, UserEntity, RemindableEntity]),
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
  providers: [
    TaskResolver,
    TaskService,
    AssigneesResolver,
    AssigneeService,
    UserService,
  ],
})
export class TasksModule {}
