import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';

import { SetupModule } from './setup/setup.module';
import { ConfigModule } from '@nestjs/config';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SetupModule,
    UsersModule,
    TeamsModule,
    TasksModule,
  ],
  providers: [],
})
export class AppModule {}
