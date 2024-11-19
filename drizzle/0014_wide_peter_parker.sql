ALTER TABLE "modalidads" RENAME TO "modalidades";--> statement-breakpoint
ALTER TABLE "regions" RENAME TO "regiones";--> statement-breakpoint
ALTER TABLE "municipios" DROP CONSTRAINT "municipios_region_id_regions_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "municipios" ADD CONSTRAINT "municipios_region_id_regiones_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regiones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
