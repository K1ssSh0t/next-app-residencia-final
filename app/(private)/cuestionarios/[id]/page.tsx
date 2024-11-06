import { notFound } from "next/navigation";
import { getCuestionarioWithRelations } from "@/repositories/cuestionario-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const cuestionario = await getCuestionarioWithRelations(id);

  if (!cuestionario) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Cuestionario</h1>
      <div>
        <p><strong>Id:</strong> { cuestionario.id }</p>
        <p><strong>Año:</strong> { cuestionario.año }</p>
        <p><strong>Carreras Id:</strong> { cuestionario.carrerasId }</p>
        <p><strong>Users Id:</strong> { cuestionario.usersId }</p>
      </div>
    </div>
  );
}
