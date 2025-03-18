import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    imports:[ConfigModule.forRoot(),MailerModule.forRoot({
        transport:{
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        },
        defaults:{
            from:'skalewayteam@gmail.com'
        }
    })],
    exports:[MailerService],
    providers:[MailerService]
})
export class MailModule {}
