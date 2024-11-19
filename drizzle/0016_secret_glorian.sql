ALTER TABLE "instituciones" RENAME COLUMN "region" TO "region_id";--> statement-breakpoint
ALTER TABLE "instituciones" RENAME COLUMN "municipio" TO "municipio_id";--> statement-breakpoint
ALTER TABLE "instituciones" RENAME COLUMN "modalidad" TO "modalidad_id";--> statement-breakpoint
ALTER TABLE "instituciones" DROP CONSTRAINT "instituciones_region_regiones_id_fk";
--> statement-breakpoint
ALTER TABLE "instituciones" DROP CONSTRAINT "instituciones_municipio_municipios_id_fk";
--> statement-breakpoint
ALTER TABLE "instituciones" DROP CONSTRAINT "instituciones_modalidad_modalidades_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_region_id_regiones_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regiones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_municipio_id_municipios_id_fk" FOREIGN KEY ("municipio_id") REFERENCES "public"."municipios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instituciones" ADD CONSTRAINT "instituciones_modalidad_id_modalidades_id_fk" FOREIGN KEY ("modalidad_id") REFERENCES "public"."modalidades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
