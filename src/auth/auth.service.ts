import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database.connection';
import * as schema from '../users/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async registerCompany(data: {
    companyName: string;
    companyEmail: string;
    location: string;
  }) {
    const company = await this.database
      .insert(schema.business)
      .values({
        business_name: data.companyName,
        email: data.companyEmail,
        location: data.location
      })
    return {message:'Company acc created',company}
  }

  async getCompany(){
    return this.database.select().from(schema.business)
  }
}
