import { notFound } from "next/navigation";
import { getUserWithRelations } from "@/repositories/user-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const user = await getUserWithRelations(id);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Users</h1>
      <div>
        <p><strong>Id:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Email Verified:</strong> {user.emailVerified?.toLocaleString()}</p>
        <p><strong>Image:</strong> {user.image}</p>
        <p><strong>Nivel Educativo:</strong> {user.nivelEducativo ? "Superior" : "Media Superior"}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Password:</strong> {user.password}</p>
      </div>
    </div>
  );
}
