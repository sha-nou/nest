CREATE TABLE "businisess" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar,
	"location" varchar,
	"email" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar,
	"business_id" uuid,
	"user_id" uuid,
	"Price" integer,
	"category" varchar DEFAULT 'PRODUCTS' NOT NULL,
	"date_Issued" date DEFAULT now(),
	"Currency" varchar,
	"dueDate" date,
	"Quantity" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar DEFAULT 'PENDING' NOT NULL,
	"total_Amount" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar,
	"email" varchar,
	"password" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_business_id_businisess_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businisess"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;