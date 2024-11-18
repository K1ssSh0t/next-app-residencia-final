import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { regions } from "@/schema/regions";

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
  return await db.query.regions.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(regions.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getRegionWithRelations(id: string) {
  return await db.query.regions.findFirst({
    where: eq(regions.id, id),
    with: undefined,
  });
}
