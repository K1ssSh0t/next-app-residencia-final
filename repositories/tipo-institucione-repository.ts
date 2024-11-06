import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { tipoInstituciones } from "@/schema/tipo-instituciones";

export type TipoInstitucionesWithRelations = Awaited<
  ReturnType<typeof getTipoInstitucionesWithRelations>
>;

export type TipoInstitucioneWithRelations = Awaited<
  ReturnType<typeof getTipoInstitucioneWithRelations>
>;

export async function getTipoInstitucionesWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.tipoInstituciones.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(tipoInstituciones.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getTipoInstitucioneWithRelations(id: string) {
  return await db.query.tipoInstituciones.findFirst({
    where: eq(tipoInstituciones.id, id),
    with: undefined,
  });
}
