ALTER TABLE "businisess" RENAME TO "business";--> statement-breakpoint
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_business_id_businisess_id_fk";
--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_business_id_businisess_id_fk";
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE no action ON UPDATE no action;