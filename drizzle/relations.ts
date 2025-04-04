import { relations } from "drizzle-orm/relations";
import { businisess, invoice, users } from "./schema";

export const invoiceRelations = relations(invoice, ({one}) => ({
	businisess: one(businisess, {
		fields: [invoice.businessId],
		references: [businisess.id]
	}),
	user: one(users, {
		fields: [invoice.userId],
		references: [users.id]
	}),
}));

export const businisessRelations = relations(businisess, ({many}) => ({
	invoices: many(invoice),
}));

export const usersRelations = relations(users, ({many}) => ({
	invoices: many(invoice),
}));