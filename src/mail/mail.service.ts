import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../users/schema';
import {Cron, CronExpression} from '@nestjs/schedule'
import { and, eq } from 'drizzle-orm';

export type MailInfo = {
  to: string;
  subject: string;
  text?: string;
};

export type OtpData = {
  email: string;
  otp: string;
};

@Injectable()
export class MailService {
  private otpStore: { [key: string]: string } = {};

  constructor(
    private mailerService: MailerService,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  generateReminder(){
    console.log('generating reminder')
  }

  async sendEmail({ to, subject, text }: MailInfo) {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);
    this.otpStore[to] = otp;

    try {
      await this.mailerService.sendMail({
        to: to,
        from: process.env.EMAIL_USER,
        subject: subject,
        text: text || `Your secret code is ${otp}`,
      });
      return {
        status: 200,
        message: 'OTP sent to your email',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        status: 400,
        message: 'Failed to send email',
      };
    }
  }

  validateOtp(email: string, otp: string): boolean {
    const storedOtp = this.otpStore[email];
    if (storedOtp && storedOtp === otp) {
      delete this.otpStore[email];
      return true;
    }
    return false;
  }

}
