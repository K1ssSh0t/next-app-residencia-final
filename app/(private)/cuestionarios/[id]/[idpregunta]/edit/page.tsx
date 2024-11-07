
import { PreguntaUpdateForm } from "@/components/private/preguntas/pregunta-update-form";
import { db } from "@/lib/db";
import { getPreguntaWithRelations } from "@/repositories/pregunta-repository";
import { notFound } from "next/navigation";

type Params = Promise<{ idpregunta: string }>;

export default async function Page(props: { params: Params }) {

  const params = await props.params;
  const { idpregunta } = params;
  //const pregunta = await db.query.preguntas.findFirst({ where: eq(preguntas.id, idpregunta) });

  const pregunta = await getPreguntaWithRelations(idpregunta);


  if (!pregunta) {
    notFound();
  }

  const categoriaPersonaList = await db.query.categoriaPersonas.findMany();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Update Pregunta</h1>
      <PreguntaUpdateForm
        pregunta={pregunta}
        categoriaPersonaList={categoriaPersonaList}
      />
    </div>
  );
}
