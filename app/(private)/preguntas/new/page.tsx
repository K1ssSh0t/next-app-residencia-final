import { db } from "@/lib/db";
import { PreguntaCreateForm } from "@/components/private/preguntas/pregunta-create-form";

export default async function Page() {
  const categoriaPersonaList = await db.query.categoriaPersonas.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Pregunta</h1>
      <PreguntaCreateForm 
        categoriaPersonaList={ categoriaPersonaList }
      />
    </div>
  );
}
