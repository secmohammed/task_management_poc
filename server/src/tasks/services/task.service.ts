import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';

import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { TaskDTO } from '../dtos/task.dto';
import { UserDTO } from '../../users/dtos/user.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasks: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}
  async findById(ownerId: string): Promise<TaskDTO[]> {
    return this.tasks.find({
      ownerId,
    });
  }
  async get(page: number = 1, recent: boolean = true): Promise<TaskDTO[]> {
    const options: FindManyOptions = {
      //   take: 25,
      //   order: {
      //     created_at: recent ? 'DESC' : 'ASC',
      //   },
      //   skip: 25 * (page - 1),
    };

    return this.tasks.find(options);
  }
  async findAssigneesForTask(id): Promise<UserDTO[]> {
    const task = await this.tasks.findOne({
      where: {
        id,
      },
      relations: ['assignees'],
    });
    return task.assignees.map((member) => member.toResponseObject(false));
  }
  async show(id): Promise<TaskDTO> {
    return this.tasks.findOneOrFail(id, {
      relations: ['members', 'owner'],
    });
  }
  async update(id, { title, status, description }): Promise<TaskDTO> {
    await this.tasks.update(id, {
      title,
      status,
      description,
    });
    const task = await this.tasks.findOne(id);
    return task;
  }
  async store({ title, status, description }, id): Promise<TaskDTO> {
    const task = await this.tasks.create({
      title,
      status,
      description,
    });
    task.owner = await this.users.findOneOrFail({ id });
    return this.tasks.save(task);
  }
  async destroy({ taskId }, id): Promise<TaskDTO> {
    const task = await this.tasks.findOneOrFail({
      where: { id: taskId, ownerId: id },
    });
    this.tasks.delete({ id: taskId });
    return task;
  }
}
