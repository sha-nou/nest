import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.connection';
import {drizzle} from 'drizzle-orm/node-postgres'
import { ConfigService } from '@nestjs/config';
import * as users from '../users/schema'
import * as business from '../users/schema'
import { Pool } from 'pg';

@Module({
    providers:[{
        provide:DATABASE_CONNECTION,
        useFactory:(configService:ConfigService)=>{
            const pool = new Pool({
                connectionString:configService.get<string>('DATABASE_URL')
            })
            return  drizzle(pool,{
                schema:{users,business}
            })
        },
        inject:[ConfigService]
    }],
    exports:[DATABASE_CONNECTION]
})
export class DatabaseModule {}
