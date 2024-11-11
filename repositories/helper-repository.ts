import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { helpers } from "@/schema/helpers";

export type HelpersWithRelations = Awaited<
  ReturnType<typeof getHelpersWithRelations>
>;

export type HelperWithRelations = Awaited<
  ReturnType<typeof getHelperWithRelations>
>;

export async function getHelpersWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.helpers.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(helpers.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getHelperWithRelations(id: string) {
  return await db.query.helpers.findFirst({
    where: eq(helpers.id, id),
    with: undefined,
  });
}
