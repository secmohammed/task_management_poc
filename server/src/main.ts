import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import compression from 'fastify-compress';

import { ValidationPipe } from './shared/pipes/validation.pipe';
import { redis } from './shared/utils/redis';
import 'dotenv/config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as hpp from 'hpp';
import { config } from './shared/config';

async function bootstrap() {
  const fastify = new FastifyAdapter({
    logger: config.APP_ENV !== 'production',
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastify,
  );
  fastify.register(require('fastify-rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    redis,
    whitelist: ['127.0.0.1'],
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true,
    },
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(hpp());

  app.register(compression, {
    encodings: ['gzip', 'deflate'],
  });

  app.use(helmet());

  app.use(helmet.noSniff());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'"],
      },
    }),
  );
  //   app.use(xssFilter());

  app.use(helmet.ieNoOpen());
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  app
    .listen(+config.APP_PORT, '0.0.0.0')
    .then(() =>
      console.log(
        `graphql started on http://localhost:${config.APP_PORT}/graphql`,
      ),
    );
}
bootstrap();
