import { Module } from '@nestjs/common';

import { UserEntity } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MailActivationProcessor } from '../users/queueables/sendMailActivation.processor';
import { TeamService } from '../teams/services/team.service';
import { TeamEntity } from '../teams/entities/team.entity';

import { RemindableEntity } from './entities/remindable.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RemindableEntity, TeamEntity]),
    BullModule.registerQueue({
      name: 'user',
    }),
  ],
  providers: [
    MailActivationProcessor,
    UserResolver,
    TeamService,
    UserService,

    //...UserDataLoader.register()
  ],
})
export class UsersModule {}
