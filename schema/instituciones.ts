import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { tipoInstituciones } from "./tipo-instituciones";
import { tipoBachilleres } from "./tipo-bachilleres";
import { users } from "./users";
import { modalidades } from "./modalidads";
import { regiones } from "./regions";
import { municipios } from "./municipios";

export type Institucion = typeof instituciones.$inferSelect;

export const instituciones = pgTable("instituciones", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombre: text(),
  regionId: text().references(() => regiones.id),
  municipioId: text().references(() => municipios.id),
  tipoInstitucionesId: text().references(() => tipoInstituciones.id),
  tipoBachilleresId: text().references(() => tipoBachilleres.id),
  claveInstitucion: text(),
  claveCentroTrabajo: text(),
  numeroCarreras: integer(),
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
    region: one(regiones, {
      fields: [instituciones.regionId],
      references: [regiones.id],
    }),
    municipio: one(municipios, {
      fields: [instituciones.municipioId],
      references: [municipios.id],
    }),
  })
);
