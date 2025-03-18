import {IsEmail,IsString,IsOptional} from 'class-validator'

export class CreateMailerDto {
    @IsEmail({},{each:true})
    recipients:string []

    @IsString()
    subject:string

    @IsString()
    html :string

    @IsString()
    @IsOptional()
    text: string
}
