import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { categoriaPersonas } from "./categoria-personas";
import { cuestionarios } from "./cuestionarios";

export type Pregunta = typeof preguntas.$inferSelect;

export const preguntas = pgTable("preguntas", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  categoriaPersonasId: text().references(() => categoriaPersonas.id),
  cuestionariosId: text().references(() => cuestionarios.id),
  cantidadMujeres: integer(),
  cantidadHombres: integer(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const preguntasRelations = relations(preguntas, ({ one, many }) => ({
  categoriaPersona: one(categoriaPersonas, {
    fields: [preguntas.categoriaPersonasId],
    references: [categoriaPersonas.id],
  }),
  cuestionario: one(cuestionarios, {
    fields: [preguntas.cuestionariosId],
    references: [cuestionarios.id],
  }),
}));
