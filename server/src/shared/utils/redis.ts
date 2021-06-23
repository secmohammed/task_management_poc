import * as client from 'redis';
export const redis = client.createClient({
  host: 'redis-server',
  port: 6379,
});
