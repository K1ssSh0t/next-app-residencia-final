CREATE TABLE IF NOT EXISTS "regions" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
