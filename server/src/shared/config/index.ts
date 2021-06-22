import 'dotenv/config';

export const config = {
  MAIL_FROM: 'someone@gmail.com',
  JWT_TOKEN: process.env.JWT_TOKEN || 'abc',
  JWT_TOKEN_EXPIRATION: process.env.JWT_TOKEN_EXPIRATION || '7d',
  APP_ENV: process.env.APP_ENV || 'development',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_URL: process.env.REDIS_URL || '127.0.0.1',
  PERSISTED_QUERY_TTL: process.env.PERSISTED_QUERY_TTL || 3600,
  APP_URL: process.env.APP_URL || '127.0.0.1',
  APP_PORT: process.env.PORT || 8000,
  MAILER: {
    HOST: process.env.MAILER_HOST,
    USERNAME: process.env.MAILER_USERNAME,
    PASSWORD: process.env.MAILER_PASSWORD,
    PORT: process.env.MAILER_PORT,
  },
};
