import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @IsNotEmpty()
  location: string;
}
