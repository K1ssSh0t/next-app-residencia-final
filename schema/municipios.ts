import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { regiones } from "./regions";

export type Municipio = typeof municipios.$inferSelect;

export const municipios = pgTable("municipios", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  nombre: text(),
  regionId: text().references(() => regiones.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const municipiosRelations = relations(municipios, ({ one, many }) => ({
  region: one(regiones, {
    fields: [municipios.regionId],
    references: [regiones.id],
  }),
}));
