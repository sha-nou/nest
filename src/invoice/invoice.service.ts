import { Injectable, Inject, NotFoundException, Body } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database.connection';
import * as schema from '../users/schema';
import { invoice } from '../users/schema';
import { eq } from 'drizzle-orm';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/createInvoiceDo';
import { InvoiceCategory } from '../auth/enums/category.enum';
import { Status } from 'src/auth/enums/status.enum';
import { join } from 'path';
import * as fs from 'fs'  
import * as PDFDocument from 'pdfkit'
import { Response } from 'express';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const { category, ...invoiceData } = createInvoiceDto;

    const newinvoice = await this.database
      .insert(schema.invoice)
      .values({
        ...invoiceData,
        status: Status.Pending,
        createdAt: new Date(),
      })

    return newinvoice;
  }

  async updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const existingInvoice = await this.database.select().from(invoice).where(eq(invoice.id, id.toString()))
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const [updatedInvoice] = await this.database
      .update(schema.invoice)
      .set(updateInvoiceDto)
      .where(eq(schema.invoice.id, 'id'))
      .returning();

    return {message:'Update successfull',updatedInvoice};
  }



  async deleteInvoice(id: number) {
    const existingInvoice = await this.getInvoiceById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    await this.database
      .delete(schema.invoice)
      .where(eq(schema.invoice.id, id.toString()));

    return { message: `Invoice with ID ${id} deleted successfully` };
  }

  async getInvoiceById(id: number) {
    const newInvoice = await this.database
      .select()
      .from(schema.invoice)
      .where(eq(invoice.id, id.toString()));

    return newInvoice;
  }

  async getAllInvoices() {
    return this.database.select().from(schema.invoice);
  }

  async getInvoicesByCategory(category: InvoiceCategory) {
    return this.database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.category, category));
  }

  async getInvoicesByStatus(status: Status) {
    return this.database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.status, status));
  }

  async changeInvoiceStatus(id: number, status: Status) {
    const existingInvoice = await this.getInvoiceById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const [updatedInvoice] = await this.database
      .update(schema.invoice)
      .set({ status })
      .where(eq(invoice.id, id.toString()))
      .returning();

    return updatedInvoice;
  }
  async uploadTemplate(file:Express.Multer.File){
    const uploadDir= join(__dirname,'..','uploads')
    if(fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir,{recursive:true})
    }
    const uploadPath= join(uploadDir,file.filename)
    fs.writeFileSync(uploadPath,file.buffer)
    return {message:"Template uploaded successfully",filePath:uploadPath}
  }

  async bulkGenerate() {
    try {
      const invoices = await this.database.select().from(schema.invoice);
      const bulkInvoices = invoices.map((invoice) => {
        return {
          ...invoice,
          status: Status.Pending,
          createdAt: new Date(),
        };
      });
      await this.database.insert(schema.invoice).values(bulkInvoices);

    } catch (error) {
      
    }
  }
  async pdfGenerate( @Body() invoice: CreateInvoiceDto, response: Response) {
    const doc = new PDFDocument({
      lang: 'en-US',
    })
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);

    doc.pipe(response);

    doc.fontSize(25).text('Invoice',{align:'center'})
    doc.moveDown()

    doc.text(`invoice ID: ${invoice.id}`,100,120)
    doc.text(`Amount: ${invoice.amount}`,100,160)
    doc.text(`Category: ${invoice.category}`,100,200)
    doc.text(`Issue Date: ${invoice.issueDate}`,100,240)
    doc.pipe(fs.createWriteStream('invoice.pdf'))
    doc.end()
  }
}
