import { notFound } from "next/navigation";
import { CarreraUpdateForm } from "@/components/admin/carreras/carrera-update-form";
import { getCarreraWithRelations } from "@/repositories/carrera-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const carrera = await getCarreraWithRelations(id);

  if (!carrera) {
    notFound();
  }


  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Editar Carrera</h1>
      <CarreraUpdateForm
        carrera={carrera}
      />
    </div>
  );
}
