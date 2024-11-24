CREATE TABLE IF NOT EXISTS "datos_institucionales" (
	"id" text PRIMARY KEY NOT NULL,
	"instituciones_id" text,
	"categorias_generales_id" text,
	"cantidad_hombres" integer,
	"cantidad_mujeres" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "datos_institucionales" ADD CONSTRAINT "datos_institucionales_instituciones_id_instituciones_id_fk" FOREIGN KEY ("instituciones_id") REFERENCES "public"."instituciones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "datos_institucionales" ADD CONSTRAINT "datos_institucionales_categorias_generales_id_categorias_generales_id_fk" FOREIGN KEY ("categorias_generales_id") REFERENCES "public"."categorias_generales"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
