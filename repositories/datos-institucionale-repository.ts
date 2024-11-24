import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { datosInstitucionales } from "@/schema/datos-institucionales";

export type DatosInstitucionalesWithRelations = Awaited<
  ReturnType<typeof getDatosInstitucionalesWithRelations>
>;

export type DatosInstitucionaleWithRelations = Awaited<
  ReturnType<typeof getDatosInstitucionaleWithRelations>
>;

export async function getDatosInstitucionalesWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.datosInstitucionales.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(datosInstitucionales.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getDatosInstitucionaleWithRelations(id: string) {
  return await db.query.datosInstitucionales.findFirst({
    where: eq(datosInstitucionales.id, id),
    with: undefined,
  });
}
