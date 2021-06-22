import * as client from 'redis';
import { config } from '../config';
export const redis = client.createClient({
});
