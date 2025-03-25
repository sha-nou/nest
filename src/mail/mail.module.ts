import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports:[ConfigModule.forRoot(),DatabaseModule,MailerModule.forRoot({
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
    exports:[MailService],
    providers:[MailService]
})
export class MailModule {}
