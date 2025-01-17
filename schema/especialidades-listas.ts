import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type EspecialidadesLista = typeof especialidadesListas.$inferSelect;

export const especialidadesListas = pgTable(
  "especialidades_listas",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    clave: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const especialidadesListasRelations = relations(especialidadesListas, ({ one, many }) => ({
}));
