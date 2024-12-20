import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { carreraInstituciones } from "./carrera-institucions";

export type Cuestionario = typeof cuestionarios.$inferSelect;

//TODO: MODIFICAR EL NOMBRE DE LA COLUMNA AÑO

export const cuestionarios = pgTable(
  "cuestionarios",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    año: integer(),
    carrerasId: text().references(() => carreraInstituciones.id),
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
    carrera: one(carreraInstituciones, {
      fields: [cuestionarios.carrerasId],
      references: [carreraInstituciones.id],
    }),
    user: one(users, {
      fields: [cuestionarios.usersId],
      references: [users.id],
    }),
  })
);
