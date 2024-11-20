import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { instituciones } from "./instituciones";
import { carreras } from "./carreras";
import { modalidads } from "./modalidads";

export type CarreraInstitucion = typeof carreraInstituciones.$inferSelect;

export const carreraInstituciones = pgTable("carrera_instituciones", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  institucionesId: text().references(() => instituciones.id),
  carrerasId: text().references(() => carreras.id),
  nombreRevoe: text(),
  planDeEstudio: text(),
  modalidadesId: text().references(() => modalidads.id),
  numeroRevoe: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const carreraInstitucionsRelations = relations(
  carreraInstituciones,
  ({ one, many }) => ({
    institucione: one(instituciones, {
      fields: [carreraInstituciones.institucionesId],
      references: [instituciones.id],
    }),
    carrera: one(carreras, {
      fields: [carreraInstituciones.carrerasId],
      references: [carreras.id],
    }),
    modalidade: one(modalidads, {
      fields: [carreraInstituciones.modalidadesId],
      references: [modalidads.id],
    }),
  })
);
