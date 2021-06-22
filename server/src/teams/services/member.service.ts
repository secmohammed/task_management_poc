import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { TeamEntity } from '../entities/team.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { TeamDTO } from '../dtos/team.dto';
import { UserDTO } from 'src/users/dtos/user.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teams: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}
  async store({ teamId, userIds }, id): Promise<TeamDTO> {
    // check if auth user belongs to this team | auth user is a member of the team.
    const team = await this.teams.findOneOrFail(
      { id: teamId },
      { relations: ['members', 'owner'] },
    );
    const users = await this.users.findByIds(userIds);
    if (!team.members.some((member) => member.id === id)) {
      team.members.push(...users);
      this.teams.save(team);
      return team;
    }
    throw new HttpException(
      'You are not a member of this team to add others',
      HttpStatus.UNAUTHORIZED,
    );
  }
  async destroy({ teamId, userIds }, id): Promise<TeamDTO> {
    const team = await this.teams.findOneOrFail(
      { id: teamId },
      { relations: ['members', 'owner'] },
    );
    // if team members has the user that should leave, and the authenticated user who tries to remove this user is also a member.
    if (team.owner.id === id) {
      team.members = team.members.filter(
        (member) => !userIds.some((userId) => userId == member.id),
      );
      this.teams.save(team);
      return team;
    }
    throw new HttpException(
      'You are not an owner of this team to remove others',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
