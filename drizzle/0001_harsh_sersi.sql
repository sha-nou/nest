CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" uuid,
	"role" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" RENAME COLUMN "total_Amount" TO "total_amount";--> statement-breakpoint
ALTER TABLE "businisess" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_business_id_businisess_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businisess"("id") ON DELETE no action ON UPDATE no action;