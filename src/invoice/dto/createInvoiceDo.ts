
import { IsEnum, IsNumber, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { InvoiceCategory } from 'src/./auth/enums/category.enum';
import { Status } from 'src/auth/enums/status.enum';

export class CreateInvoiceDto {
  @IsNumber()
  id:string

  @IsNumber()
  amount: number;

  @IsEnum(InvoiceCategory)
  category: string;

  @IsDateString()
  issueDate?: string;

  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  businessId: string;

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
  status?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  description?: string;
}