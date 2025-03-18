import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { CreateMailerDto } from './dto/create-mailer.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService:  MailerService) {}

  @Post()
  async sendMail(@Body() dto:CreateMailerDto) {
    console.log(this.mailerService.sendEmail,dto);
    
     await this.mailerService.sendEmail(dto)
    
     return{message:'Email sent successfully'}
  }
}
