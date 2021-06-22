import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';

import { TeamEntity } from '../entities/team.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { TeamDTO } from '../dtos/team.dto';
import { UserDTO } from '../../users/dtos/user.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teams: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}
  async findById(ownerId: string): Promise<TeamDTO[]> {
    return this.teams.find({
      ownerId,
    });
  }
  async get(page: number = 1, recent: boolean = true): Promise<TeamDTO[]> {
    const options: FindManyOptions = {
      //   take: 10,
      //   order: {
      //     created_at: recent ? 'DESC' : 'ASC',
      //   },
      //   skip: 10 * (page - 1),
    };

    return this.teams.find(options);
  }
  async findMembersForTeam(id): Promise<UserDTO[]> {
    const team = await this.teams.findOne({
      where: {
        id,
      },
      relations: ['members'],
    });
    return team.members.map((member) => member.toResponseObject(false));
  }
  async show(id): Promise<TeamDTO> {
    return this.teams.findOneOrFail(id, {
      relations: ['members', 'owner'],
    });
  }
  async store({ name }, id): Promise<TeamDTO> {
    const team = await this.teams.create({
      name,
    });
    team.owner = await this.users.findOneOrFail({ id });
    await this.teams.save(team);
    return team;
  }
  async destroy({ teamId }, id): Promise<TeamDTO> {
    const team = await this.teams.findOneOrFail({
      where: { id: teamId, ownerId: id },
    });
    this.teams.delete({ id: teamId });
    return team;
  }
}
