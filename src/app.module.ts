import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { InvoiceService } from './invoice/invoice.service';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ MailModule,ConfigModule.forRoot({isGlobal:true}), AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, MailService, InvoiceService, UsersService],
})
export class AppModule {}
