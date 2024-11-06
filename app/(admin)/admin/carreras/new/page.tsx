import { CarreraCreateForm } from "@/components/admin/carreras/carrera-create-form";

export default async function Page() {

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Carrera</h1>
      <CarreraCreateForm 
      />
    </div>
  );
}
