import { Factory, Seeder } from 'typeorm-seeding';
import { TaskEntity } from '../entities/task.entity';

export default class CreateTasks implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(TaskEntity)().createMany(10);
  }
}
