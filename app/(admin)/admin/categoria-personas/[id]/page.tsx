import { notFound } from "next/navigation";
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
      <h1 className="text-xl font-bold mb-6">Categoria Personas</h1>
      <div>
        <p><strong>Id:</strong> { categoriaPersona.id }</p>
        <p><strong>Descripcion:</strong> { categoriaPersona.descripcion }</p>
      </div>
    </div>
  );
}
