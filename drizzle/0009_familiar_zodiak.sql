CREATE TABLE IF NOT EXISTS "helpers" (
	"id" text PRIMARY KEY NOT NULL,
	"estado_cuestionario" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
