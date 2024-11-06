import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { preguntas } from "@/schema/preguntas";

export type PreguntasWithRelations = Awaited<
  ReturnType<typeof getPreguntasWithRelations>
>;

export type PreguntaWithRelations = Awaited<
  ReturnType<typeof getPreguntaWithRelations>
>;

export async function getPreguntasWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.preguntas.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(preguntas.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getPreguntaWithRelations(id: string) {
  return await db.query.preguntas.findFirst({
    where: eq(preguntas.id, id),
    with: undefined,
  });
}
