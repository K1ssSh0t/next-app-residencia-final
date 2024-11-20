CREATE TABLE IF NOT EXISTS "carrera_instituciones" (
	"id" text PRIMARY KEY NOT NULL,
	"instituciones_id" text,
	"carreras_id" text,
	"nombre_revoe" text,
	"plan_de_estudio" text,
	"modalidades_id" text,
	"numero_revoe" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carrera_instituciones" ADD CONSTRAINT "carrera_instituciones_instituciones_id_instituciones_id_fk" FOREIGN KEY ("instituciones_id") REFERENCES "public"."instituciones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carrera_instituciones" ADD CONSTRAINT "carrera_instituciones_carreras_id_carreras_id_fk" FOREIGN KEY ("carreras_id") REFERENCES "public"."carreras"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carrera_instituciones" ADD CONSTRAINT "carrera_instituciones_modalidades_id_modalidades_id_fk" FOREIGN KEY ("modalidades_id") REFERENCES "public"."modalidades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
