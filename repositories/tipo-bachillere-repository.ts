import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";

export type TipoBachilleresWithRelations = Awaited<
  ReturnType<typeof getTipoBachilleresWithRelations>
>;

export type TipoBachillereWithRelations = Awaited<
  ReturnType<typeof getTipoBachillereWithRelations>
>;

export async function getTipoBachilleresWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.tipoBachilleres.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(tipoBachilleres.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getTipoBachillereWithRelations(id: string) {
  return await db.query.tipoBachilleres.findFirst({
    where: eq(tipoBachilleres.id, id),
    with: undefined,
  });
}
