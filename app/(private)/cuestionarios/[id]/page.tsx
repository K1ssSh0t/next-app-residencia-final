import { notFound } from "next/navigation";
import { getCuestionarioWithRelations } from "@/repositories/cuestionario-repository";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { preguntas } from "@/schema/preguntas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PreguntaTable } from "@/components/private/preguntas/pregunta-user-table";
import PreguntaForm from "./nueva-tabla";
import { categoriaPersonas } from "@/schema/categoria-personas";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const cuestionario = await getCuestionarioWithRelations(id);

  if (!cuestionario) {
    notFound();
  }
  const user = cuestionario.user;

  const applicableNivel = user?.nivelEducativo ? "superior" : "medioSuperior";
  // Obtener todas las categorías
  const categoriasList = await db.select().from(categoriaPersonas).where(
    or(
      eq(categoriaPersonas.nivelAplicado, applicableNivel),
      eq(categoriaPersonas.nivelAplicado, "ambos")
    ));

  // Obtener las preguntas del cuestionario
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
        <p className="hidden"><strong>Id:</strong> {cuestionario.id}</p>
        <p><strong>Año:</strong> {cuestionario.año}</p>
        <p><strong>Carreras Id:</strong> {cuestionario.carrerasId}</p>
        <p><strong>Users Id:</strong> {cuestionario.usersId}</p>
      </div>
      <div className="text-right mr-2">
        {/* <Link href={{ pathname: "/preguntas/new", query: { cuestionario: id } }}>
          <Button>
            <PlusIcon className="mr-2" /> New
          </Button>
        </Link> */}
      </div>
      <div className=" flex flex-1 justify-center items-center justify-items-center">
        {/* <PreguntaTable preguntaList={preguntasList} /> */}
        <PreguntaForm preguntaList={preguntasList}
          categoriasList={categoriasList}
          cuestionarioId={id} />
      </div>
    </div>
  );
}
