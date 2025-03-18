// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// import { CreateMailerDto } from './dto/create-mailer.dto';
// import * as crypto from 'crypto'

// @Injectable()
// export class MailerService {
//   constructor(private readonly configService: ConfigService) {}
//   mailTransport() {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       secure: false,
//       auth: {
//         user: this.configService.get<string>('EMAIL_USER'),
//         pass: this.configService.get<string>('EMAIL_PASS'),
//       },
//     });

//     return transporter;
//   }

//   async genearateOtp() {
//     return crypto.randomInt(100000,999999).toString()
//   }

//   async sendEmail(dto: CreateMailerDto) {
//     const { recipients, subject, text } = dto;
//     const otp=this.genearateOtp()
//     console.log(otp)

//     const transport = this.mailTransport();

//     const options: nodemailer.SendMailOptions = {
//       from: this.configService.get<string>('EMAIL_USER'),
//       to: recipients,
//       subject: subject,
//       html: text,
//     };
//     try {
//     const trans=  await transport.sendMail(options);
//     // console.log(trans)
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.log('Error sending mail: ', error);
//     };
//   }
// }

// constructor(private readonly configService: ConfigService) {
//   // Initialize OAuth2 client
//   const REFRESH_TOKEN= 1//044L8SAnuUGpQCgYIARAAGAQSNwF-L9IrUWxBBCbFfsN2bEJe6oYi1cTAXWp3pZjrbsJGKjmz1B8xD3-K63PTmGDx0ZsJuvlHTd8
//   this.oauth2Client = new google.auth.OAuth2(
//     this.configService.get<string>('CLIENT_ID'),
//     this.configService.get<string>('REDIRECT_URI'),
//     this.configService.get<string>('CLIENT_SECRET')
//   );
//   this.oauth2Client.setCredentials({REFRESH_TOKEN});
//   console.log('Refresh Token:',REFRESH_TOKEN );
// }
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { credentials } from './cred';

@Injectable()
export class MailerService {
  private oauth2Client;
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(dto: CreateMailerDto) {
    const { recipients, subject, text } = dto;

    //generating random otp
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);

    this.oauth2Client = new google.auth.OAuth2(
      credentials.CLIENT_ID,
      credentials.CLIENT_SECRET,
    );

    this.oauth2Client.setCredentials({
      refresh_token: credentials.REFRESH_TOKEN,
    });
    const accessToken = await this.oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('EMAIL_USER'),
        clientId: this.configService.get<string>('CLIENT_ID'),
        clientSecret: this.configService.get<string>('CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('REFRESH_TOKEN'),
        accessToken: accessToken.token,
      },
    });

    const options: nodemailer.SendMailOptions = {
      from: credentials.EMAIL_USER,
      to: recipients,
      subject: subject,
      html: text.replace('{{otp}}', otp),
    };

    try {
      const result = await transport.sendMail(options);
      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending mail: ', error);
      throw error;
    }
  }
}
