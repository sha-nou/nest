import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from './dto/createCompany.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    registerCompany(@Body() registerData:CreateCompanyDto){
        return this.authService.registerCompany(registerData)
    }
    @Get('company')
    getCompany(){
        return this.authService.getCompany()
    }
}
