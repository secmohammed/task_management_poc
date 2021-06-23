import { Factory, Seeder } from 'typeorm-seeding';
import { TeamEntity } from '../entities/team.entity';

export default class CreateTeams implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(TeamEntity)().createMany(10);
  }
}
