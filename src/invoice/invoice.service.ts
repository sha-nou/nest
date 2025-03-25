
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.connection';
import * as schema from '../users/schema';
import { invoice } from '../users/schema';
import { eq } from 'drizzle-orm';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/createInvoiceDo';
import { InvoiceCategory } from '../auth/enums/category.enum';
import { Status } from 'src/auth/enums/status.enum';

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
        category: InvoiceCategory.PRODUCTS,
        status: Status.Pending, 
        createdAt: new Date(),
      })
      .returning();

    return newinvoice;
  }

  async updateInvoice(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const existingInvoice = await this.getInvoiceById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const [updatedInvoice] = await this.database
      .update(schema.invoice)
      .set(updateInvoiceDto)
      .where(eq(schema.invoice.id, id))
      .returning();

    return updatedInvoice;
  }

  async deleteInvoice(id: number) {
    const existingInvoice = await this.getInvoiceById(id);
    if (!existingInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    await this.database
      .delete(schema.invoice)
      .where(eq(schema.invoice.id, id));

    return { message: `Invoice with ID ${id} deleted successfully` };
  }

  async getInvoiceById(id: number) {
    const newInvoice = await this.database
      .select()
      .from(schema.invoice)
      .where(eq(invoice.id,id));

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
      .where(eq(invoice.id, id))
      .returning();

    return updatedInvoice;
  }
}
