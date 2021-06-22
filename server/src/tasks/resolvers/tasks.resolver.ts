import {
  Resolver,
  Query,
  Context,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../shared/middlewares/auth.guard';
import { CreateTask } from '../validation/create-task.validation';
import { DeleteTask } from '../validation/delete-task.validation';
import { IsID } from '../../shared/validations/id.validation';
import { TaskService } from '../services/task.service';
import { TaskDTO } from '../dtos/task.dto';
import { UserService } from '../../users/services/user.service';
import { UserDTO } from '../../users/dtos/user.dto';
import { UpdateTask } from '../validation/update-task.validation';

@Resolver(() => TaskDTO)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [TaskDTO])
  tasks(
    @Args({ name: 'page', defaultValue: 1, type: () => Number }) page: number,
  ): Promise<TaskDTO[]> {
    return this.taskService.get(page);
  }
  @Query(() => TaskDTO)
  showTask(@Args('data') { id }: IsID): Promise<TaskDTO> {
    return this.taskService.show(id);
  }
  @Mutation(() => TaskDTO)
  @UseGuards(new AuthGuard())
  updateTask(@Args('data') { title, status, description, id }: UpdateTask) {
    return this.taskService.update(id, { title, status, description });
  }
  @Mutation(() => TaskDTO)
  @UseGuards(new AuthGuard())
  createTask(
    @Args('data') { title, status, description }: CreateTask,
    @Context('user') { id }: IsID,
  ): Promise<TaskDTO> {
    return this.taskService.store({ title, status, description }, id);
  }
  @ResolveField(() => UserDTO)
  owner(@Parent() parent: TaskDTO): Promise<UserDTO> {
    return this.userService.findById(parent.ownerId);
  }
  @ResolveField(() => [UserDTO])
  async assignees(@Parent() parent: TaskDTO) {
    return this.taskService.findAssigneesForTask(parent.id);
  }

  @Mutation(() => TaskDTO)
  @UseGuards(new AuthGuard())
  deleteTask(
    @Args('data') { taskId }: DeleteTask,
    @Context('user') { id }: IsID,
  ): Promise<TaskDTO> {
    return this.taskService.destroy({ taskId }, id);
  }
}
