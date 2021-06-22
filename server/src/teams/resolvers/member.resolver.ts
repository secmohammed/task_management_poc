import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../shared/middlewares/auth.guard';
import { CreateMember } from '../validation/create-member.validation';
import { DestroyMember } from '../validation/destroy-member.validation';
import { IsID } from '../../shared/validations/id.validation';
import { MemberService } from '../services/member.service';
import { TeamDTO } from '../dtos/team.dto';

@Resolver('member')
export class MemberResolver {
  constructor(private readonly members: MemberService) {}
  @UseGuards(new AuthGuard())
  @Mutation(() => TeamDTO)
  async storeMember(
    @Args('data') data: CreateMember,
    @Context('user') { id }: IsID,
  ): Promise<TeamDTO> {
    return this.members.store(data, id);
  }
  @UseGuards(new AuthGuard())
  @Mutation(() => TeamDTO)
  deleteMember(
    @Args('data') data: DestroyMember,
    @Context('user') { id }: IsID,
  ): Promise<TeamDTO> {
    return this.members.destroy(data, id);
  }
}
