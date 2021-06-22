import { Process, Processor, OnQueueFailed, OnQueueError } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { config } from '../../shared/config';
@Processor('user')
export class MailActivationProcessor {
  private readonly logger = new Logger(MailActivationProcessor.name);
  constructor(private readonly mailService: MailerService) {}
  @OnQueueFailed()
  handler(job: Job, err: Error) {
    //TODO: log to database the failed jobs.
  }
  @Process('send_mail_activation')
  async handleMailActivation(job: Job) {
    this.mailService.sendMail({
      to: job.data.user.email,
      from: config.MAIL_FROM,
      subject: 'activate your account',
      template: 'activation',
      context: {
        user: job.data.user,
        token: job.data.token.token,
      },
    });
  }
  @OnQueueError()
  onError(err: Error) {
    //TODO: Log Queue Error to DB.
  }

  @Process('send_forget_pw_email')
  async handleForgetPassword(job: Job) {
    this.mailService.sendMail({
      to: job.data.user.email,
      from: config.MAIL_FROM,
      subject: 'Reset your password',
      template: 'forget_password',
      context: {
        user: job.data.user,
        token: job.data.token.token,
      },
    });
  }
}
