import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export type Modalidad = typeof modalidads.$inferSelect;

export const modalidads = pgTable("modalidades", {
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
  modalidads,
  ({ one, many }) => ({})
);
