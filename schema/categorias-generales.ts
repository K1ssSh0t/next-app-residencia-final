import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type CategoriasGenerale = typeof categoriasGenerales.$inferSelect;

export const categoriasGenerales = pgTable(
  "categorias_generales",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const categoriasGeneralesRelations = relations(categoriasGenerales, ({ one, many }) => ({
}));
