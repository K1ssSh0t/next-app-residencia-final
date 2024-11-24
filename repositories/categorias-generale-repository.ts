import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { categoriasGenerales } from "@/schema/categorias-generales";

export type CategoriasGeneralesWithRelations = Awaited<
  ReturnType<typeof getCategoriasGeneralesWithRelations>
>;

export type CategoriasGeneraleWithRelations = Awaited<
  ReturnType<typeof getCategoriasGeneraleWithRelations>
>;

export async function getCategoriasGeneralesWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.categoriasGenerales.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(categoriasGenerales.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getCategoriasGeneraleWithRelations(id: string) {
  return await db.query.categoriasGenerales.findFirst({
    where: eq(categoriasGenerales.id, id),
    with: undefined,
  });
}
