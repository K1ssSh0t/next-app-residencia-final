import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";

export type CategoriaPersonasWithRelations = Awaited<
  ReturnType<typeof getCategoriaPersonasWithRelations>
>;

export type CategoriaPersonaWithRelations = Awaited<
  ReturnType<typeof getCategoriaPersonaWithRelations>
>;

export async function getCategoriaPersonasWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.categoriaPersonas.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(categoriaPersonas.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getCategoriaPersonaWithRelations(id: string) {
  return await db.query.categoriaPersonas.findFirst({
    where: eq(categoriaPersonas.id, id),
    with: undefined,
  });
}
