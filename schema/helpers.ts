import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";


export type Helper = typeof helpers.$inferSelect;

export const helpers = pgTable(
  "helpers",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    estadoCuestionario: boolean(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
  }
)

export const helpersRelations = relations(helpers, ({ one, many }) => ({
}));
