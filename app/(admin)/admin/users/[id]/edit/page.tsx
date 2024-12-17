import { notFound } from "next/navigation";
import { UserUpdateForm } from "@/components/admin/users/user-update-form";
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
    <div className="flex flex-col justify-center items-left max-w-xl gap-2 mt-4 ">
      <h1 className="text-xl font-bold mb-6">Editar Usuario</h1>
      <UserUpdateForm
        user={user}
      />
    </div>
  );
}
