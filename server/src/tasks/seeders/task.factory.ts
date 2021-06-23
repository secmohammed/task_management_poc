import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { UserEntity } from '../../users/entities/user.entity';
import { TaskEntity } from '../entities/task.entity';
define(TaskEntity, (faker: typeof Faker) => {
  const title = faker.lorem.words();
  const description = faker.lorem.sentences();
  const status = faker.random.arrayElement(['pending', 'closed', 'open']);

  const task = new TaskEntity();
  task.title = title;
  task.description = description;
  task.status = status;
  task.owner = factory(UserEntity)() as any;
  task.assignees = factory(UserEntity)().createMany(2) as any;
  return task;
});
