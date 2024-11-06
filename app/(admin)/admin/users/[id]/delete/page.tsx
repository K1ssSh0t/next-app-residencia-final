import { UserDeleteForm } from "@/components/admin/users/user-delete-form";
import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete User</h1>
      <UserDeleteForm user={ user } />
    </div>
  );
}
