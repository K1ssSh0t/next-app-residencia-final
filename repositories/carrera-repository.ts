import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { carreras } from "@/schema/carreras";

export type CarrerasWithRelations = Awaited<
  ReturnType<typeof getCarrerasWithRelations>
>;

export type CarreraWithRelations = Awaited<
  ReturnType<typeof getCarreraWithRelations>
>;

export async function getCarrerasWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.carreras.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(carreras.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getCarreraWithRelations(id: string) {
  return await db.query.carreras.findFirst({
    where: eq(carreras.id, id),
    with: undefined,
  });
}
