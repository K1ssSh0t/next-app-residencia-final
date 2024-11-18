import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { municipios } from "@/schema/municipios";

export type MunicipiosWithRelations = Awaited<
  ReturnType<typeof getMunicipiosWithRelations>
>;

export type MunicipioWithRelations = Awaited<
  ReturnType<typeof getMunicipioWithRelations>
>;

export async function getMunicipiosWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.municipios.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(municipios.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getMunicipioWithRelations(id: string) {
  return await db.query.municipios.findFirst({
    where: eq(municipios.id, id),
    with: undefined,
  });
}
