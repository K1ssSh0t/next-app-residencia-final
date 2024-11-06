import { UserCreateForm } from "@/components/admin/users/user-create-form";

export default async function Page() {

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create User</h1>
      <UserCreateForm 
      />
    </div>
  );
}
