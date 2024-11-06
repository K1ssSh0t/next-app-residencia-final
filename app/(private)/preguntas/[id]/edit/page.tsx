import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PreguntaUpdateForm } from "@/components/private/preguntas/pregunta-update-form";
import { getPreguntaWithRelations } from "@/repositories/pregunta-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const pregunta = await getPreguntaWithRelations(id);

  if (!pregunta) {
    notFound();
  }

  const categoriaPersonaList = await db.query.categoriaPersonas.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Pregunta</h1>
      <PreguntaUpdateForm 
        pregunta={ pregunta }
        categoriaPersonaList={ categoriaPersonaList }
      />
    </div>
  );
}
