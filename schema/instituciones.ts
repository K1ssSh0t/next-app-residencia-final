import { relations } from "drizzle-orm";
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { tipoInstituciones } from "./tipo-instituciones";
import { tipoBachilleres } from "./tipo-bachilleres";
import { users } from "./users";
import { modalidads } from "./modalidads";
import { regions } from "./regions";
import { municipios } from "./municipios";

export type Institucione = typeof instituciones.$inferSelect;

//TODO:AGREGAR RELACION CON MODALIDAD, MUNICIPIO Y REGION

export const instituciones = pgTable("instituciones", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombre: text(),
  regionId: text().references(() => regions.id),
  municipioId: text().references(() => municipios.id),
  tipoInstitucionesId: text().references(() => tipoInstituciones.id),
  tipoBachilleresId: text().references(() => tipoBachilleres.id),
  modalidadId: text().references(() => modalidads.id),
  usersId: text()
    .references(() => users.id)
    .unique(),
  nivelEducativo: boolean(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const institucionesRelations = relations(
  instituciones,
  ({ one, many }) => ({
    tipoInstituciones: one(tipoInstituciones, {
      fields: [instituciones.tipoInstitucionesId],
      references: [tipoInstituciones.id],
    }),
    tipoBachilleres: one(tipoBachilleres, {
      fields: [instituciones.tipoBachilleresId],
      references: [tipoBachilleres.id],
    }),
    user: one(users, {
      fields: [instituciones.usersId],
      references: [users.id],
    }),
    modalidad: one(modalidads, {
      fields: [instituciones.modalidadId],
      references: [modalidads.id],
    }),
    region: one(regions, {
      fields: [instituciones.regionId],
      references: [regions.id],
    }),
    municipio: one(municipios, {
      fields: [instituciones.municipioId],
      references: [municipios.id],
    }),
  })
);
