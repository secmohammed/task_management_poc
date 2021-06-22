import {
  Query,
  Resolver,
  Context,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../shared/middlewares/auth.guard';
import { LoginUser } from '../validation/login-user.validation';
import { RegisterUser } from '../validation/register-user.validation';
import { UserDTO } from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { ForgotPasswordDTO } from '../validation/forgot-password.dto';
import { ResetPasswordDTO } from '../validation/reset-password.dto';
import { ChangePasswordDTO } from '../validation/change-password.dto';
import { RemindableDTO } from '../dtos/remindable.dto';
import { TeamDTO } from '../../teams/dtos/team.dto';
import { TeamService } from '../../teams/services/team.service';

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
  ) {}
  @ResolveField(() => [TeamDTO])
  teams(@Parent() parent: UserDTO): Promise<TeamDTO[]> {
    return this.teamService.findById(parent.id);
  }

  @Query(() => [UserDTO])
  users(
    @Args({ name: 'page', defaultValue: 1, type: () => Number }) page: number,
  ) {
    return this.userService.get(page);
  }
  @Mutation(() => UserDTO)
  async login(@Args('data') data: LoginUser): Promise<UserDTO> {
    return this.userService.login(data);
  }
  @Mutation(() => UserDTO)
  register(@Args('data') data: RegisterUser) {
    return this.userService.register(data);
  }

  @Query(() => UserDTO)
  @UseGuards(new AuthGuard())
  me(@Context('user') { id }) {
    return this.userService.me(id);
  }

  @Mutation(() => RemindableDTO)
  async forgotPassword(
    @Args('input') input: ForgotPasswordDTO,
  ): Promise<Partial<RemindableDTO>> {
    return this.userService.forgotPassword(input);
  }

  @Mutation(() => UserDTO)
  async resetPassword(
    @Args('input') input: ResetPasswordDTO,
  ): Promise<UserDTO> {
    return this.userService.resetPassword(input);
  }

  @Mutation(() => UserDTO)
  @UseGuards(AuthGuard)
  async changePassword(
    @Args('input') input: ChangePasswordDTO,
    @Context('user') { id }: { id: string },
  ): Promise<UserDTO> {
    return this.userService.changePassword(input, id);
  }
}
