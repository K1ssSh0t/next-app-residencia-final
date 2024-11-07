import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { carreras } from "./carreras";
import { users } from "./users";

export type Cuestionario = typeof cuestionarios.$inferSelect;

export const cuestionarios = pgTable(
  "cuestionarios",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    año: integer(),
    carrerasId: text().references(() => carreras.id),
    usersId: text().references(() => users.id),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (cuestionarios) => ({
    userCarreraUnique: uniqueIndex("user_carrera_unique").on(
      cuestionarios.usersId,
      cuestionarios.carrerasId
    ),
  })
);

export const cuestionariosRelations = relations(
  cuestionarios,
  ({ one, many }) => ({
    carrera: one(carreras, {
      fields: [cuestionarios.carrerasId],
      references: [carreras.id],
    }),
    user: one(users, {
      fields: [cuestionarios.usersId],
      references: [users.id],
    }),
  })
);
