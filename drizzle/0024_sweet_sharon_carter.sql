CREATE TABLE IF NOT EXISTS "especialidades" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text,
	"hombres" integer,
	"mujeres" integer,
	"cuestionario_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "especialidades" ADD CONSTRAINT "especialidades_cuestionario_id_cuestionarios_id_fk" FOREIGN KEY ("cuestionario_id") REFERENCES "public"."cuestionarios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
