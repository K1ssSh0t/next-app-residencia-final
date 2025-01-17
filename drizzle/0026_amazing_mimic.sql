CREATE TABLE "especialidades_listas" (
	"id" text PRIMARY KEY NOT NULL,
	"descripcion" text,
	"clave" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
