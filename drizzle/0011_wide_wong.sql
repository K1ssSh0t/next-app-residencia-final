CREATE TABLE IF NOT EXISTS "modalidads" (
	"id" text PRIMARY KEY NOT NULL,
	"descripcion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
