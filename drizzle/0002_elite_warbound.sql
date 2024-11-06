CREATE TABLE IF NOT EXISTS "instituciones" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text,
	"region" text,
	"municipio" text,
	"tipo_instituciones_id" text,
	"tipo_bachilleres_id" text,
	"users_id" text,
	"nivel_educativo" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_tipo_instituciones_id_tipo_instituciones_id_fk" FOREIGN KEY ("tipo_instituciones_id") REFERENCES "public"."tipo_instituciones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_tipo_bachilleres_id_tipo_bachilleres_id_fk" FOREIGN KEY ("tipo_bachilleres_id") REFERENCES "public"."tipo_bachilleres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
