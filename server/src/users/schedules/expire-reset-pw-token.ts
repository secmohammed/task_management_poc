import { scheduleJob, cancelJob } from 'node-schedule';
import { RemindableEntity as Remindable } from '../entities/remindable.entity';

export const QueueExpireToken = (token: Remindable) => {
  scheduleJob(`expire_token_${token.id}`, token.expires_at, async () => {
    await Remindable.update(token.id, { is_expired: true });
    return token;
  });
};

export const CancelExpireTokenJob = (token: Remindable) => {
  cancelJob(`expire_token_${token.id}`);
};
