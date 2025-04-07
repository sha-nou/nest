import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports:[MulterModule.register({
        dest:"/uploads"
    }),DatabaseModule],
    controllers:[InvoiceController],
    providers:[InvoiceService]
})
export class InvoiceModule {}
