CREATE TABLE IF NOT EXISTS "preguntas" (
	"id" text PRIMARY KEY NOT NULL,
	"categoria_personas_id" text,
	"cuestionarios_id" text,
	"cantidad_mujeres" integer,
	"cantidad_hombres" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_categoria_personas_id_categoria_personas_id_fk" FOREIGN KEY ("categoria_personas_id") REFERENCES "public"."categoria_personas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_cuestionarios_id_cuestionarios_id_fk" FOREIGN KEY ("cuestionarios_id") REFERENCES "public"."cuestionarios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
