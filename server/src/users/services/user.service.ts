import { UserDTO } from '../dtos/user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { compareSync, hashSync, genSaltSync } from 'bcryptjs';
import * as moment from 'moment';
import { randomBytes } from 'crypto';

import { LoginUser } from '../validation/login-user.validation';
import { RegisterUser } from '../validation/register-user.validation';
import { UserEntity as User } from '../entities/user.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RemindableEntity as Remindable } from '../entities/remindable.entity';

import {
  QueueExpireToken,
  CancelExpireTokenJob,
} from '../schedules/expire-reset-pw-token';
import { ChangePasswordDTO } from '../validation/change-password.dto';
import { ResetPasswordDTO } from '../validation/reset-password.dto';
import { ForgotPasswordDTO } from '../validation/forgot-password.dto';
import { RemindableDTO } from '../dtos/remindable.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue('user')
    private readonly userQueue: Queue,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Remindable)
    private readonly remindables: Repository<Remindable>,
  ) {}

  async findById(id: string): Promise<UserDTO> {
    const user = await this.users.findOne({
      id,
    });
    return user.toResponseObject(false);
  }
  async findByIds(ids: string[]): Promise<UserDTO[]> {
    const users = await this.users.findByIds(ids);
    return users.map((user: UserDTO) => user.toResponseObject(false));
  }

  async get(
    page: number = 1,
    recent: boolean = true,
  ): Promise<Partial<UserDTO[]>> {
    const options: FindManyOptions = {
      take: 25,
      order: {
        created_at: recent ? 'DESC' : 'ASC',
      },
      skip: 25 * (page - 1),
    };
    const users = await this.users.find(options);
    return users.map((user: User) => user.toResponseObject(false));
  }
  async login({ email, password }: LoginUser): Promise<UserDTO> {
    const user = await this.users.findOneOrFail({
      where: { email },
    });
    if (!compareSync(password, user.password)) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }
    if (!user.email_verified)
      throw new UnauthorizedException('User email is not verified');
    return user.toResponseObject(true);
  }
  async register({
    password,
    password_confirmation,
    email,
    name,
  }: RegisterUser): Promise<UserDTO> {
    if (password != password_confirmation) {
      throw new NotFoundException(
        'Password and password_confirmation should match',
      );
    }

    const count = await this.users.count({
      where: {
        email,
      },
    });
    if (count) {
      throw new NotFoundException('email exists, please pick up another one.');
    }

    let user = await this.users.create({
      name,
      email,
      password,
      email_verified: false,
      email_verified_at: null,
    });
    user = await this.users.save(user);
    let userToken = await this.remindables.create({
      user,
      type: 'activation',
      is_used: false,
      token: randomBytes(8).toString('hex'),
      expires_at: moment().add(2, 'days'),
      is_expired: false,
    });
    userToken = await this.remindables.save(userToken);
    QueueExpireToken(userToken);
    await this.userQueue.add(
      'send_mail_activation',
      { user },
      { removeOnComplete: true },
    );
    return user.toResponseObject();
  }

  async me({ id }: any): Promise<UserDTO> {
    const user = await this.users.findOneOrFail(id, {
      relations: ['teams'],
    });
    return user.toResponseObject(false);
  }

  async resendActivationEmail(email: string): Promise<RemindableDTO> {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    if (user.email_verified)
      throw new UnauthorizedException('User email is already verified');

    const userToken = await this.remindables.findOne({
      where: { type: 'activation', user_id: user.id },
    });
    if (userToken.is_expired) {
      await this.remindables.update(userToken.id, {
        is_expired: false,
        token: randomBytes(8).toString('hex'),
      });
      QueueExpireToken(userToken);
    }

    await this.userQueue.add(
      'send_mail_activation',
      { user, token: userToken },
      { removeOnComplete: true },
    );
    return userToken;
  }

  async activateAccount(token: string): Promise<UserDTO> {
    const userToken = await this.remindables.findOne({ where: { token } });
    if (!userToken) throw new NotFoundException('Token is invalid');

    if (userToken.is_expired)
      throw new UnauthorizedException('Token is expired');

    const user = await this.users.findOne(userToken.user.id);
    await this.users.update(user.id, {
      email_verified: true,
      email_verified_at: new Date(),
    });

    CancelExpireTokenJob(userToken);
    await userToken.remove();

    return user.toResponseObject(true);
  }

  async forgotPassword({ email }: ForgotPasswordDTO): Promise<RemindableDTO> {
    const user = await this.users.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('Email is not registered');

    let userToken = await this.remindables.findOne({
      where: { user_id: user.id, type: 'reset-password' },
    });
    if (userToken) {
      await this.remindables.update(userToken.id, {
        expires_at: moment().add(1, 'hour'),
        is_expired: false,
      });
    } else {
      userToken = await this.remindables.create({
        user,
        type: 'reset-password',
        is_used: false,
        token: randomBytes(8).toString('hex'),
        expires_at: moment().add(30, 'second'),
        is_expired: false,
      });
    }

    QueueExpireToken(userToken);

    await this.userQueue.add(
      'send_forget_pw_email',
      { user, token: userToken },
      { removeOnComplete: true },
    );

    return userToken;
  }

  async resetPassword({ token, password }: ResetPasswordDTO): Promise<UserDTO> {
    const userToken = await this.remindables.findOne({ where: { token } });

    if (!userToken) throw new BadRequestException('Invalid verification token');
    if (userToken.is_expired) throw new BadRequestException('Token is expired');

    const user = await this.users.findOne(userToken.user);
    const newPassword = hashSync(password, genSaltSync(10));
    await this.users.update(user.id, { password: newPassword });
    CancelExpireTokenJob(userToken);
    await userToken.remove();
    return user.toResponseObject(true);
  }

  async changePassword(
    { old_password, password }: ChangePasswordDTO,
    user_id: string,
  ): Promise<UserDTO> {
    const user = await this.users.findOne(user_id);
    if (!compareSync(old_password, user.password)) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    await this.users.update(user_id, {
      password: hashSync(password, genSaltSync(10)),
    });

    return user.toResponseObject(true);
  }
}
