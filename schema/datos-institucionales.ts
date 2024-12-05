import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { instituciones } from "./instituciones";
import { categoriasGenerales } from "./categorias-generales";

export type DatosInstitucionales = typeof datosInstitucionales.$inferSelect;

export const datosInstitucionales = pgTable("datos_institucionales", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  institucionesId: text().references(() => instituciones.id),
  categoriasGeneralesId: text().references(() => categoriasGenerales.id),
  cantidadHombres: integer(),
  cantidadMujeres: integer(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const datosInstitucionalesRelations = relations(
  datosInstitucionales,
  ({ one, many }) => ({
    institucion: one(instituciones, {
      fields: [datosInstitucionales.institucionesId],
      references: [instituciones.id],
    }),
    categoriasGenerales: one(categoriasGenerales, {
      fields: [datosInstitucionales.categoriasGeneralesId],
      references: [categoriasGenerales.id],
    }),
  })
);
