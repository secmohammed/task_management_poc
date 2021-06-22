import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../shared/middlewares/auth.guard';
import { CreateAssignees } from '../validation/create-assignees.validation';
import { DestroyAssignees } from '../validation/destroy-assignees.validation';
import { AssigneeService } from '../services/assignee.service';
import { UserDTO } from '../../users/dtos/user.dto';
import { TaskDTO } from '../dtos/task.dto';
import { ValidationPipe } from '../../shared/pipes/validation.pipe';

@Resolver('assignees')
export class AssigneesResolver {
  constructor(private readonly assignees: AssigneeService) {}
  @UseGuards(new AuthGuard())
  @Mutation(() => [UserDTO])
  async storeAssignees(
    @Args('data', new ValidationPipe()) data: CreateAssignees,
  ): Promise<UserDTO[]> {
    return this.assignees.store(data);
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => TaskDTO)
  deleteAssignees(
    @Args('data', new ValidationPipe()) data: DestroyAssignees,
  ): Promise<TaskDTO> {
    return this.assignees.destroy(data);
  }
}
