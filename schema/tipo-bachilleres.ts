import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type TipoBachillere = typeof tipoBachilleres.$inferSelect;

export const tipoBachilleres = pgTable(
  "tipo_bachilleres",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    descripcion: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const tipoBachilleresRelations = relations(tipoBachilleres, ({ one, many }) => ({
}));
