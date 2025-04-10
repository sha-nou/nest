import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { DATABASE_CONNECTION } from '../database/database.connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../users/schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { and, eq, gte, lt } from 'drizzle-orm';
import { addDays, format } from 'date-fns';
import { Status } from '../auth/enums/status.enum';

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
  async generateReminder() {
    const today = new Date();
    const threeDays = addDays(today, 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDays.toISOString().split('T')[0];

    const unpaidInvoices = await this.database
      .select({
        id: schema.invoice.id,
        dueDate: schema.invoice.dueDate,
        email: schema.invoice.business_email,
        name: schema.business.business_name,
      })
      .from(schema.invoice)
      .innerJoin(
        schema.business,
        eq(schema.invoice.business_id, schema.business.id),
      )
      .where(
        and(
          eq(schema.invoice.status, Status.Pending),
          gte(schema.invoice.dueDate, todayStr),
          lt(schema.invoice.dueDate, threeDaysStr),
        ),
      )
      .execute();
    for (const invoice of unpaidInvoices) {
      const daysLeft = invoice.dueDate
        ? Math.ceil(
            (new Date(invoice.dueDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 0;
      console.log('Unpaid invoices:', unpaidInvoices, daysLeft);

    const result=  await this.mailerService.sendMail({
        to: 'njingtishanelle103@gmail.com',
        from: process.env.EMAIL_USER,
        subject: 'Invoice Reminder',
        text: `Hello ${schema.business.business_name},\n\nJust a reminder that your invoice (ID: ${schema.invoice.id}) is due 
        in ${daysLeft} days.\n\nPlease ensure payment before the due date to avoid any late fees.\n\nThank you!`,
      });
      return {message:"sent",result}
    }
   
  }
  async sendEmail({ to, subject, text }: MailInfo) {
    // const otp = crypto.randomInt(100000, 999999).toString();
    // console.log('Generated OTP:', otp);
    // this.otpStore[to] = otp;
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.EMAIL_USER,
        subject,
        text
      });
      return {
        status: 200,
        message: 'Reminder sent to your email',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        status: 400,
        message: 'Failed to send email',
      };
    }
  }

  // validateOtp(email: string, otp: string): boolean {
  //   const storedOtp = this.otpStore[email];
  //   if (storedOtp && storedOtp === otp) {
  //     delete this.otpStore[email];
  //     return true;
  //   }
  //   return false;
  // }
}
