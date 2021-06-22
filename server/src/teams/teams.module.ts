import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberResolver } from './resolvers/member.resolver';
import { MemberService } from './services/member.service';
import { TeamEntity } from './entities/team.entity';
import { TeamResolver } from './resolvers/teams.resolver';
import { TeamService } from './services/team.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/services/user.service';
import { BullModule } from '@nestjs/bull';
import { RemindableEntity } from '../users/entities/remindable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamEntity, UserEntity, RemindableEntity]),
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
  providers: [
    TeamResolver,
    TeamService,
    MemberResolver,
    MemberService,
    UserService,
  ],
})
export class TeamsModule {}
