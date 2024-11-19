ALTER TABLE "instituciones" ADD COLUMN "modalidad" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_region_regiones_id_fk" FOREIGN KEY ("region") REFERENCES "public"."regiones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_municipio_municipios_id_fk" FOREIGN KEY ("municipio") REFERENCES "public"."municipios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_modalidad_modalidades_id_fk" FOREIGN KEY ("modalidad") REFERENCES "public"."modalidades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
