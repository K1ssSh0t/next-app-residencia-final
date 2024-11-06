import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type TipoInstitucione = typeof tipoInstituciones.$inferSelect;

export const tipoInstituciones = pgTable(
  "tipo_instituciones",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const tipoInstitucionesRelations = relations(tipoInstituciones, ({ one, many }) => ({
}));