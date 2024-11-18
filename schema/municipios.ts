import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { regions } from "./regions";


export type Municipio = typeof municipios.$inferSelect;

export const municipios = pgTable(
  "municipios",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    nombre: text(),
    regionId: text().references(() => regions.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const municipiosRelations = relations(municipios, ({ one, many }) => ({
  region: one(regions, {
    fields: [municipios.regionId],
    references: [regions.id]
  }),
}));
