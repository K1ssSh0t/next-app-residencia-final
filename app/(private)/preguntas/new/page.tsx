import { db } from "@/lib/db";
import { PreguntaCreateForm } from "@/components/private/preguntas/pregunta-create-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {

  const searchParams = await props.searchParams;
  const { cuestionario } = searchParams;

  const categoriaPersonaList = await db.query.categoriaPersonas.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Pregunta</h1>
      <PreguntaCreateForm
        categoriaPersonaList={categoriaPersonaList}
        cuestionario={cuestionario as string}
      />
    </div>
  );
}
