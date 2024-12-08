import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";

export type EspecialidadsWithRelations = Awaited<
  ReturnType<typeof getEspecialidadsWithRelations>
>;

export type EspecialidadWithRelations = Awaited<
  ReturnType<typeof getEspecialidadWithRelations>
>;

export async function getEspecialidadsWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.especialidades.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(especialidades.id, `%${search}%`) : undefined,
    with: undefined,
  });
}

export async function getEspecialidadWithRelations(id: string) {
  return await db.query.especialidades.findFirst({
    where: eq(especialidades.id, id),
    with: undefined,
  });
}
