import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { modalidades } from "@/schema/modalidads";

export type ModalidadsWithRelations = Awaited<
  ReturnType<typeof getModalidadsWithRelations>
>;

export type ModalidadWithRelations = Awaited<
  ReturnType<typeof getModalidadWithRelations>
>;

export async function getModalidadsWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.modalidades.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(modalidades.id, `%${search}%`) : undefined,
    with: undefined,
  });
}

export async function getModalidadWithRelations(id: string) {
  return await db.query.modalidades.findFirst({
    where: eq(modalidades.id, id),
    with: undefined,
  });
}
