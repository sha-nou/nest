import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/createInvoiceDo';
import { Status } from '../auth/enums/status.enum';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/enums/roles.enum';
import { InvoiceCategory } from 'src/auth/enums/category.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('invoice')
export class InvoiceController { 
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Role(Roles.Admin, Roles.Accountant)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.getAllInvoices();
  }

  @Put(':id')
  @Role(Roles.Admin, Roles.Accountant)
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.updateInvoice(Number(id), updateInvoiceDto);
  }

  @Delete(':id')
  @Role(Roles.Admin)
  remove(@Param('id') id: number) {
    return this.invoiceService.deleteInvoice(id);
  }
  @Get('status/:status')
  findByStatus(@Param('status') status: Status) {
    return this.invoiceService.getInvoicesByStatus(status);
  }

  @Put(':id/status')
  @Role(Roles.Admin, Roles.Accountant)
  updateStatus(@Param('id') id: number, @Query('status') status: Status) {
    return this.invoiceService.changeInvoiceStatus(id, status);
  }
  @Get('cat/:category')
  findByCategory(@Param('category') category: InvoiceCategory) {
    return this.invoiceService.getInvoicesByCategory(category);
  }
  // @Post('upload-template')
  // @UseInterceptors(FileInterceptor('file'))
  // upload(@UploadedFile() file: Express.Multer.File) {
  //   return this.invoiceService.uploadTemplate(file);
  // }
  
  @Post('generate-pdf')
  @UseInterceptors(FileInterceptor('file'))
  generatePdf(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if(!file){
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const invoiceData: CreateInvoiceDto = JSON.parse(file.buffer.toString());
    return this.invoiceService.pdfGenerate(invoiceData, res );
  }
}
