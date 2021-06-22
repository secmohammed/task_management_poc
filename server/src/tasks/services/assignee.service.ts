import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { TaskDTO } from '../dtos/task.dto';
import { UserDTO } from '../../users/dtos/user.dto';

@Injectable()
export class AssigneeService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasks: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}
  async store({ taskId, userIds }): Promise<UserDTO[]> {
    const task = await this.tasks.findOneOrFail(
      { id: taskId },
      { relations: ['assignees'] },
    );
    const users = await this.users.findByIds(userIds);
    task.assignees.push(...users);
    await this.tasks.save(task);
    return users.map((user) => user.toResponseObject(false));
  }
  async destroy({ taskId, userIds }): Promise<TaskDTO> {
    const task = await this.tasks.findOneOrFail(
      { id: taskId },
      { relations: ['assignees'] },
    );
    task.assignees = task.assignees.filter(
      (assignee) => !userIds.some((userId) => userId == assignee.id),
    );
    await this.tasks.save(task);
    return task;
  }
}
