import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService ,MailInfo} from './mail.service';


@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}
//     @Post('sendMail')
//   sendMail(@Body() sendEmail:MailInfo ){
//     return this.mailService.sendEmail(sendEmail)
//   }
//   @Post('validate-otp')
//   validateOtp(@Body() validate:OtpData) {
//     const { email, otp } = validate;
//     const isValid = this.mailService.validateOtp(email, otp);

//     if (isValid) {
//       return { status: 200, message: 'OTP is valid' };
//     } else {
//       return { status: 400, message: 'Invalid OTP' };
//     }
//   }
@Get('generate-reminder')
getReminders(){
    return this.mailService.generateReminder()
}
@Post('generate-reminder')
generateReminder() {
    return this.mailService.generateReminder();
  }
}
