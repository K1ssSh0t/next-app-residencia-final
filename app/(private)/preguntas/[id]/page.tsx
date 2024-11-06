import { notFound } from "next/navigation";
import { getPreguntaWithRelations } from "@/repositories/pregunta-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const pregunta = await getPreguntaWithRelations(id);

  if (!pregunta) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Preguntas</h1>
      <div>
        <p><strong>Id:</strong> { pregunta.id }</p>
        <p><strong>Categoria Personas Id:</strong> { pregunta.categoriaPersonasId }</p>
        <p><strong>Cuestionarios Id:</strong> { pregunta.cuestionariosId }</p>
        <p><strong>Cantidad Mujeres:</strong> { pregunta.cantidadMujeres }</p>
        <p><strong>Cantidad Hombres:</strong> { pregunta.cantidadHombres }</p>
      </div>
    </div>
  );
}
