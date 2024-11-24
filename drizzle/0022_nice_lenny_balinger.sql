CREATE TABLE IF NOT EXISTS "categorias_generales" (
	"id" text PRIMARY KEY NOT NULL,
	"descripcion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
