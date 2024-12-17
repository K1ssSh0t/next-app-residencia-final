import { CarreraCreateForm } from "@/components/admin/carreras/carrera-create-form";

export default async function Page() {

  return (
    <div className="flex flex-col gap-5 w-2/5">
      <h1 className="text-xl font-bold mb-6">Crear Carrera</h1>
      <CarreraCreateForm
      />
    </div>
  );
}
