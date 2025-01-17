import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { cuestionarios } from "./cuestionarios";
import { especialidadesListas } from "./especialidades-listas";

export type Especialidad = typeof especialidades.$inferSelect;

export const especialidades = pgTable("especialidades", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombreEspecialidad: text().references(() => especialidadesListas.id),
  hombres: integer(),
  mujeres: integer(),
  cuestionarioId: text().references(() => cuestionarios.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const especialidadesRelations = relations(
  especialidades,
  ({ one, many }) => ({
    cuestionario: one(cuestionarios, {
      fields: [especialidades.cuestionarioId],
      references: [cuestionarios.id],
    }),
    especialidadLista: one(especialidadesListas, {
      fields: [especialidades.nombreEspecialidad],
      references: [especialidadesListas.id],
    }),
  })
);
