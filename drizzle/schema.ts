import { pgTable, uuid, varchar, timestamp, foreignKey, serial, integer, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const businisess = pgTable("businisess", {
	id: uuid().primaryKey().notNull(),
	name: varchar(),
	location: varchar(),
	email: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const invoice = pgTable("invoice", {
	id: serial().primaryKey().notNull(),
	invoiceNumber: varchar("invoice_number"),
	businessId: uuid("business_id"),
	userId: uuid("user_id"),
	price: integer("Price"),
	category: varchar().default('PRODUCTS').notNull(),
	dateIssued: date("date_Issued").defaultNow(),
	currency: varchar("Currency"),
	dueDate: date(),
	quantity: integer("Quantity"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	status: varchar().default('PENDING').notNull(),
	totalAmount: integer("total_Amount"),
}, (table) => [
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businisess.id],
			name: "invoice_business_id_businisess_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "invoice_user_id_users_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	username: varchar(),
	email: varchar(),
	password: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});
