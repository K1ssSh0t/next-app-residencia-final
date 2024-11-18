import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { modalidads } from "@/schema/modalidads";

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
  return await db.query.modalidads.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(modalidads.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getModalidadWithRelations(id: string) {
  return await db.query.modalidads.findFirst({
    where: eq(modalidads.id, id),
    with: undefined,
  });
}
