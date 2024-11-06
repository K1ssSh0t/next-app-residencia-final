import { relations } from "drizzle-orm";
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { tipoInstituciones } from "./tipo-instituciones";
import { tipoBachilleres } from "./tipo-bachilleres";
import { users } from "./users";

export type Institucione = typeof instituciones.$inferSelect;

export const instituciones = pgTable("instituciones", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombre: text(),
  region: text(),
  municipio: text(),
  tipoInstitucionesId: text().references(() => tipoInstituciones.id),
  tipoBachilleresId: text().references(() => tipoBachilleres.id),
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
    tipoInstitucione: one(tipoInstituciones, {
      fields: [instituciones.tipoInstitucionesId],
      references: [tipoInstituciones.id],
    }),
    tipoBachillere: one(tipoBachilleres, {
      fields: [instituciones.tipoBachilleresId],
      references: [tipoBachilleres.id],
    }),
    user: one(users, {
      fields: [instituciones.usersId],
      references: [users.id],
    }),
  })
);
