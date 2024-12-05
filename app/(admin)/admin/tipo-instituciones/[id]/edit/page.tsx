import { notFound } from "next/navigation";
import { TipoInstitucioneUpdateForm } from "@/components/admin/tipo-instituciones/tipo-institucione-update-form";
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
      <h1 className="text-xl font-bold mb-6">Edit Tipoinstitucion</h1>
      <TipoInstitucioneUpdateForm
        tipoInstitucione={tipoInstitucion}
      />
    </div>
  );
}
