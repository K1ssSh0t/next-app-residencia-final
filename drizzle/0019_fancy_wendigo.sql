ALTER TABLE "cuestionarios" DROP CONSTRAINT "cuestionarios_carreras_id_carreras_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cuestionarios" ADD CONSTRAINT "cuestionarios_carreras_id_carrera_instituciones_id_fk" FOREIGN KEY ("carreras_id") REFERENCES "public"."carrera_instituciones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
