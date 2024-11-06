CREATE TABLE IF NOT EXISTS "cuestionarios" (
	"id" text PRIMARY KEY NOT NULL,
	"a_o" integer,
	"carreras_id" text,
	"users_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_carreras_id_carreras_id_fk" FOREIGN KEY ("carreras_id") REFERENCES "public"."carreras"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
