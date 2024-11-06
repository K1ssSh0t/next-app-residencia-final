import { notFound } from "next/navigation";
import { getTipoInstitucioneWithRelations } from "@/repositories/tipo-institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const tipoInstitucione = await getTipoInstitucioneWithRelations(id);

  if (!tipoInstitucione) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Tipo Instituciones</h1>
      <div>
        <p><strong>Id:</strong> { tipoInstitucione.id }</p>
        <p><strong>Descripcion:</strong> { tipoInstitucione.descripcion }</p>
      </div>
    </div>
  );
}
