import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

export type MailInfo = {
  to: string;
  subject: string;
  text?: string;
};

export type OtpData={
    email:string
    otp:string
}

@Injectable()
export class MailService {
  private otpStore: { [key: string]: string } = {}; // In-memory storage for OTPs

  constructor(private mailerService: MailerService) {}

  async sendEmail({ to, subject, text }: MailInfo) {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);
    this.otpStore[to] = otp; // Store OTP associated with the email

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