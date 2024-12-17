import { notFound } from "next/navigation";
import { getTipoInstitucioneWithRelations } from "@/repositories/tipo-institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const tipoInstitucion = await getTipoInstitucioneWithRelations(id);

  if (!tipoInstitucion) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Tipo Instituciones</h1>
      <div>
        <p><strong>Id:</strong> {tipoInstitucion.id}</p>
        <p><strong>Descripcion:</strong> {tipoInstitucion.descripcion}</p>
      </div>
    </div>
  );
}
