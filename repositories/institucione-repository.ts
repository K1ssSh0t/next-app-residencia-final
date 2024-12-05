import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";

export type InstitucionesWithRelations = Awaited<
  ReturnType<typeof getInstitucionesWithRelations>
>;

export type InstitucioneWithRelations = Awaited<
  ReturnType<typeof getInstitucionWithRelations>
>;

export async function getInstitucionesWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.instituciones.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(instituciones.id, `%${search}%`) : undefined,
    with: {
      tipoBachilleres: true,
      tipoInstituciones: true,
      municipio: true,
      region: true,
    },
  });
}

export async function getInstitucionWithRelations(id: string) {
  return await db.query.instituciones.findFirst({
    where: eq(instituciones.id, id),
    with: {
      tipoBachilleres: true,
      tipoInstituciones: true,
      municipio: true,
      region: true,
    },
  });
}
