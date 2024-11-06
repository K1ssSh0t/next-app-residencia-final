import { PreguntaDeleteForm } from "@/components/private/preguntas/pregunta-delete-form";
import { db } from "@/lib/db";
import { preguntas } from "@/schema/preguntas";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const pregunta = await db.query.preguntas.findFirst({ where: eq(preguntas.id, id) });

  if (!pregunta) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Pregunta</h1>
      <PreguntaDeleteForm pregunta={ pregunta } />
    </div>
  );
}
