import { InvoiceCategory } from 'src/auth/enums/category.enum';
import { Status } from 'src/auth/enums/status.enum';
import { IsEnum, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  id:number

  @IsNumber()
  amount: number;

  @IsEnum(InvoiceCategory)
  category: InvoiceCategory;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  description?: string;

  
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(InvoiceCategory)
  category?: InvoiceCategory;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  description?: string;
}