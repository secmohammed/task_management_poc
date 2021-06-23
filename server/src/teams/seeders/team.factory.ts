import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { TeamEntity } from '../entities/team.entity';
import { UserEntity } from '../../users/entities/user.entity';
define(TeamEntity, (faker: typeof Faker) => {
  const name = faker.name.findName();
  const team = new TeamEntity();
  team.name = name;
  team.owner = factory(UserEntity)() as any;
  team.members = factory(UserEntity)().createMany(2) as any;
  return team;
});
