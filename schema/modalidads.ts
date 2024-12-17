import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export type Modalidad = typeof modalidades.$inferSelect;

export const modalidades = pgTable("modalidades", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  descripcion: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const modalidadsRelations = relations(
  modalidades,
  ({ one, many }) => ({})
);
