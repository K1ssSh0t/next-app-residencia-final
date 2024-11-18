import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type Region = typeof regions.$inferSelect;

export const regions = pgTable(
  "regions",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    nombre: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const regionsRelations = relations(regions, ({ one, many }) => ({
}));
