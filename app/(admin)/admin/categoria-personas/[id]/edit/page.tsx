import { notFound } from "next/navigation";
import { CategoriaPersonaUpdateForm } from "@/components/admin/categoria-personas/categoria-persona-update-form";
import { getCategoriaPersonaWithRelations } from "@/repositories/categoria-persona-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const categoriaPersona = await getCategoriaPersonaWithRelations(id);

  if (!categoriaPersona) {
    notFound();
  }


  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Categoria Persona</h1>
      <CategoriaPersonaUpdateForm 
        categoriaPersona={ categoriaPersona }
      />
    </div>
  );
}
