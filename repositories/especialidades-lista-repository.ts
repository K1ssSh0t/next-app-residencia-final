import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { especialidadesListas } from "@/schema/especialidades-listas";

export type EspecialidadesListasWithRelations = Awaited<
  ReturnType<typeof getEspecialidadesListasWithRelations>
>;

export type EspecialidadesListaWithRelations = Awaited<
  ReturnType<typeof getEspecialidadesListaWithRelations>
>;

export async function getEspecialidadesListasWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.especialidadesListas.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(especialidadesListas.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getEspecialidadesListaWithRelations(id: string) {
  return await db.query.especialidadesListas.findFirst({
    where: eq(especialidadesListas.id, id),
    with: undefined,
  });
}
