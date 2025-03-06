import { users } from "@/schema/users";
import bcrypt from "bcrypt";
import { openConnection } from "./sdb";
import { helpers } from "@/schema/helpers";

async function main() {
  const { sdb, closeConnection } = await openConnection();
  const email = "admin";
  const password = "mypassword";
  const hash = bcrypt.hashSync(password, 10);
  await sdb
    .insert(users)
    .values({ email: email, password: hash, role: "admin" });
  console.log("created user " + email);

  await sdb.insert(helpers).values({ estadoCuestionario: true });
  await closeConnection();
}

main();
