import { date, integer, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { InvoiceCategory } from "src/auth/enums/category.enum";
import { Status } from "src/auth/enums/status.enum";

export const users=pgTable('users',{
    id:uuid('id').primaryKey(),
    username:varchar('username'),
    email:varchar('email'),
    password:varchar('password'),
    createdAt:timestamp('created_at').notNull().defaultNow(),
})

export const business= pgTable('businisess',{
    id:uuid('id').primaryKey(),
    business_name:varchar('name'),
    location:varchar('location'),
    email:varchar('email'),
    createdAt:timestamp('created_at').notNull().defaultNow(),
})

export const invoice=pgTable('invoice',{
    id:serial('id').primaryKey(),
    invoice_number:varchar('invoice_number'),
    business_id:uuid('business_id').references(()=>business.id),
    user_id:uuid('user_id').references(()=>users.id),
    Price:integer(),
    category:varchar('category').notNull().default(InvoiceCategory.PRODUCTS),
    date_Issued:date().defaultNow(),
    Currency:varchar(),
    dueDate:date(),
    Quantity:integer(),
    createdAt:timestamp('created_at').notNull().defaultNow(),
    status:varchar('status').notNull().default(Status.Pending),
    total_Amount:integer(),
})
