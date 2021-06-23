import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { config } from '../shared/config';
import { BaseRedisCache } from 'apollo-server-cache-redis';

import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { GraphQLErrorFilter } from '../shared/filters/graphql-exception.filter';
import * as winston from 'winston';
import { MailerModule } from '@nestjs-modules/mailer';
import { TwingAdapter } from '../shared/mailer/twing.adapter';

import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { BullModule } from '@nestjs/bull';
import { redis } from '../shared/utils/redis';
const ormconfig = require('../../ormconfig.json');

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis-server',
        port: 6379,
      },
    }),
    WinstonModule.forRoot({
      level: 'error',
      format: winston.format.json(),
      defaultMeta: { service: 'task-service' },
      transports: [
        new winston.transports.File({ filename: 'error.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
            winston.format.colorize({ all: true }),
          ),
        }),
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      persistedQueries: {
        ttl: config.PERSISTED_QUERY_TTL as number, // 1h
        cache: new BaseRedisCache({
          client: redis,
        }),
      },
      context: ({ request }) => ({ headers: request.headers }),
      debug: true,
      installSubscriptionHandlers: true,
      playground: true,
      uploads: {
        maxFileSize: 10000000, // 10MB
        maxFiles: 1,
      },
    }),
    TypeOrmModule.forRoot(ormconfig[0]),
    MailerModule.forRoot({
      transport: {
        host: config.MAILER.HOST,
        port: config.MAILER.PORT,
        tls: {
          servername: config.MAILER.HOST,
        },
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: config.MAILER.USERNAME,
          pass: config.MAILER.PASSWORD,
        },
      },
      template: {
        dir: `${process.cwd()}/src/shared/mailer/templates/`,
        adapter: new TwingAdapter(),
      },
    }),
  ],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },

    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class SetupModule {}
