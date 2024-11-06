import { eq } from "drizzle-orm";
import { openConnection } from "./sdb";
import { users } from "@/schema/users";
import { db } from "@/lib/db";

async function main() {
  const { sdb, closeConnection } = await openConnection();

  const email = process.argv[2];

  const user = await sdb.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("user not found " + email);
  }

  await db.update(users).set({ role: "admin" }).where(eq(users.email, email));

  console.log("granted admin role to user " + email);

  await closeConnection();
}

main();
