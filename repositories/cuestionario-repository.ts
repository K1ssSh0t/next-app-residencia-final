import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { cuestionarios } from "@/schema/cuestionarios";

export type CuestionariosWithRelations = Awaited<
  ReturnType<typeof getCuestionariosWithRelations>
>;

export type CuestionarioWithRelations = Awaited<
  ReturnType<typeof getCuestionarioWithRelations>
>;

export async function getCuestionariosWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.cuestionarios.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(cuestionarios.id, `%${search}%`) : undefined,
    with: undefined,
  });
}

export async function getCuestionarioWithRelations(id: string) {
  return await db.query.cuestionarios.findFirst({
    where: eq(cuestionarios.id, id),
    with: {
      carrera: true,
      user: true,
    },
  });
}
