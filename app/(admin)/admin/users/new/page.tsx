import { UserCreateForm } from "@/components/admin/users/user-create-form";

export default async function Page() {

  return (
    <div className="flex flex-col justify-center items-left max-w-md gap-2 mt-4 ">
      <h1 className="text-xl font-bold mb-6">Crear Nuevo Usuario</h1>
      <UserCreateForm
      />
    </div>
  );
}
