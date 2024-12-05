import { TipoInstitucioneCreateForm } from "@/components/admin/tipo-instituciones/tipo-institucione-create-form";

export default async function Page() {

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Tipoinstitucion</h1>
      <TipoInstitucioneCreateForm
      />
    </div>
  );
}
