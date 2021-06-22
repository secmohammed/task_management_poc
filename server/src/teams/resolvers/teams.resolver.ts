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
import { CreateTeam } from '../validation/create-team.validation';
import { DeleteTeam } from '../validation/delete-team.validation';
import { IsID } from '../../shared/validations/id.validation';
import { TeamService } from '../services/team.service';
import { TeamDTO } from '../dtos/team.dto';
import { UserService } from '../../users/services/user.service';
import { UserDTO } from '../../users/dtos/user.dto';

@Resolver(() => TeamDTO)
export class TeamResolver {
  constructor(
    private readonly teamService: TeamService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [TeamDTO])
  teams(
    @Args({ name: 'page', defaultValue: 1, type: () => Number }) page: number,
  ): Promise<TeamDTO[]> {
    return this.teamService.get(page);
  }
  @Query(() => TeamDTO)
  showTeam(@Args('data') { id }: IsID): Promise<TeamDTO> {
    return this.teamService.show(id);
  }
  @Mutation(() => TeamDTO)
  @UseGuards(new AuthGuard())
  createTeam(
    @Args('data') { name }: CreateTeam,
    @Context('user') { id }: IsID,
  ): Promise<TeamDTO> {
    return this.teamService.store({ name }, id);
  }
  @ResolveField(() => UserDTO)
  owner(@Parent() parent: TeamDTO): Promise<UserDTO> {
    return this.userService.findById(parent.ownerId);
  }
  @ResolveField(() => [UserDTO])
  members(@Parent() parent: TeamDTO): Promise<UserDTO[]> {
    return this.teamService.findMembersForTeam(parent.id);
  }

  @Mutation(() => TeamDTO)
  @UseGuards(new AuthGuard())
  deleteTeam(
    @Args('data') { teamId }: DeleteTeam,
    @Context('user') { id }: IsID,
  ): Promise<TeamDTO> {
    return this.teamService.destroy({ teamId }, id);
  }
}
