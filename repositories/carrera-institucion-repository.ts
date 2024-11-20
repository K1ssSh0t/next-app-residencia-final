import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { carreraInstituciones } from "@/schema/carrera-institucions";

export type CarreraInstitucionsWithRelations = Awaited<
  ReturnType<typeof getCarreraInstitucionsWithRelations>
>;

export type CarreraInstitucionWithRelations = Awaited<
  ReturnType<typeof getCarreraInstitucionWithRelations>
>;

export async function getCarreraInstitucionsWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.carreraInstituciones.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(carreraInstituciones.id, `%${search}%`) : undefined,
    with: undefined,
  });
}

export async function getCarreraInstitucionWithRelations(id: string) {
  return await db.query.carreraInstituciones.findFirst({
    where: eq(carreraInstituciones.id, id),
    with: undefined,
  });
}
