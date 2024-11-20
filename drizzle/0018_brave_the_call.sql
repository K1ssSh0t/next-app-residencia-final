ALTER TABLE "instituciones" DROP CONSTRAINT "instituciones_modalidad_id_modalidades_id_fk";
--> statement-breakpoint
ALTER TABLE "instituciones" DROP COLUMN IF EXISTS "modalidad_id";