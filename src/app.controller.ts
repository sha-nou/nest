import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {  MailInfo, MailService, OtpData } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService , private readonly mailService:MailService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('sendMail')
  sendMail(@Body() sendEmail:MailInfo ){
    return this.mailService.sendEmail(sendEmail)
  }
  @Post('validate-otp')
  validateOtp(@Body() validate:OtpData) {
    const { email, otp } = validate;
    const isValid = this.mailService.validateOtp(email, otp);

    if (isValid) {
      return { status: 200, message: 'OTP is valid' };
    } else {
      return { status: 400, message: 'Invalid OTP' };
    }
  }
}
