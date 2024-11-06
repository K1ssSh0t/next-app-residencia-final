import { notFound } from "next/navigation";
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
      <h1 className="text-xl font-bold mb-6">Carreras</h1>
      <div>
        <p><strong>Id:</strong> { carrera.id }</p>
        <p><strong>Descripcion:</strong> { carrera.descripcion }</p>
      </div>
    </div>
  );
}
