import { timestamp, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text(),
  email: text().notNull().unique(),
  emailVerified: timestamp({ mode: "date" }),
  nombreContacto: text(),
  correoContacto: text(),
  image: text(),
  role: text().notNull(),
  nivelEducativo: boolean(),
  password: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
