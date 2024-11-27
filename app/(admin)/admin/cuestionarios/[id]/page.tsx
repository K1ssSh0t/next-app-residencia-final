import { notFound } from "next/navigation";
import { getCuestionarioWithRelations } from "@/repositories/cuestionario-repository";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { preguntas } from "@/schema/preguntas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PreguntaTable } from "@/components/private/preguntas/pregunta-user-table";



type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    const cuestionario = await getCuestionarioWithRelations(id);

    if (!cuestionario) {
        notFound();
    }

    const preguntasList = await db.query.preguntas.findMany({
        with: {
            categoriaPersona: true,
        },
        where: eq(preguntas.cuestionariosId, id)
    });


    return (
        <div>
            <h1 className="text-xl font-bold mb-6">Cuestionario</h1>
            <div>
                <p><strong>Id:</strong> {cuestionario.id}</p>
                <p><strong>Año:</strong> {cuestionario.año}</p>
                <p><strong>Carreras Id:</strong> {cuestionario.carrera?.nombreRevoe}</p>
                <p><strong>Users Id:</strong> {cuestionario.usersId}</p>
            </div>
            <div>
                {/* <Link href={{ pathname: "/preguntas/new", query: { cuestionario: id } }}>
          <Button>
            <PlusIcon className="mr-2" /> New
          </Button>
        </Link> */}
            </div>
            <div>
                <PreguntaTable preguntaList={preguntasList} />
            </div>
        </div>
    );
}
