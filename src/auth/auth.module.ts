import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  imports:[DatabaseModule],
  controllers: [AuthController]
})
export class AuthModule {}
