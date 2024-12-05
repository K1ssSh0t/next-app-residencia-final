import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export type Region = typeof regiones.$inferSelect;

export const regiones = pgTable("regiones", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombre: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const regionsRelations = relations(regiones, ({ one, many }) => ({}));
