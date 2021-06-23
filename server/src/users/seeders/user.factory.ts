import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { UserEntity } from '../entities/user.entity';
define(UserEntity, (faker: typeof Faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const user = new UserEntity();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.password = 'password';
  user.email_verified = true;
  user.email_verified_at = new Date();
  return user;
});
