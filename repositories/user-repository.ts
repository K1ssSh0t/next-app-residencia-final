import { eq, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/schema/users";

export type UsersWithRelations = Awaited<
  ReturnType<typeof getUsersWithRelations>
>;

export type UserWithRelations = Awaited<
  ReturnType<typeof getUserWithRelations>
>;

export async function getUsersWithRelations({
  limit,
  offset,
  search,
}: {
  limit: number;
  offset: number;
  search?: string;
}) {
  return await db.query.users.findMany({
    limit: limit,
    offset: offset,
    where: search ? like(users.id, `%${search}%`) : undefined,
    with: undefined
  });
}

export async function getUserWithRelations(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    with: undefined,
  });
}
