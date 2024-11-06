import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type CategoriaPersona = typeof categoriaPersonas.$inferSelect;

export const categoriaPersonas = pgTable(
  "categoria_personas",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const categoriaPersonasRelations = relations(categoriaPersonas, ({ one, many }) => ({
}));
