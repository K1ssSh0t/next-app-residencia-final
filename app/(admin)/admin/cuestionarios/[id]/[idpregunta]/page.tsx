import { db } from "@/lib/db";
import { getPreguntaWithRelations } from "@/repositories/pregunta-repository";
import { preguntas } from "@/schema/preguntas";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ idpregunta: string }>;


export default async function Page(props: { params: Params }) {

    const params = await props.params;


    const { idpregunta } = params;

    // const pregunta = await db.query.preguntas.findFirst({ where: eq(preguntas.id, idpregunta as string) });
    const pregunta = await getPreguntaWithRelations(idpregunta);
    if (!pregunta) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-6">Preguntas</h1>
            <div>
                <p><strong>Id:</strong> {pregunta.id}</p>
                <p><strong>Categoria Personas Id:</strong> {pregunta.categoriaPersonasId}</p>
                <p><strong>Cuestionarios Id:</strong> {pregunta.cuestionariosId}</p>
                <p><strong>Cantidad Mujeres:</strong> {pregunta.cantidadMujeres}</p>
                <p><strong>Cantidad Hombres:</strong> {pregunta.cantidadHombres}</p>
            </div>
        </div>
    );
}
