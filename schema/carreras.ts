import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type Carrera = typeof carreras.$inferSelect;

export const carreras = pgTable(
  "carreras",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const carrerasRelations = relations(carreras, ({ one, many }) => ({
}));
