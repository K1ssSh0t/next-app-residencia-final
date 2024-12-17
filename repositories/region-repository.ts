import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { regiones } from "@/schema/regions";

export type RegionsWithRelations = Awaited<
  ReturnType<typeof getRegionsWithRelations>
>;

export type RegionWithRelations = Awaited<
  ReturnType<typeof getRegionWithRelations>
>;

export async function getRegionsWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.regiones.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(regiones.id, `%${search}%`) : undefined,
    with: undefined,
  });
}

export async function getRegionWithRelations(id: string) {
  return await db.query.regiones.findFirst({
    where: eq(regiones.id, id),
    with: undefined,
  });
}
