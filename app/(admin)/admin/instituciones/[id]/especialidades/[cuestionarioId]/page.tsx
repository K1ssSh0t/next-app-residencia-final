import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { especialidades } from "@/schema/especialidades";
import { CombinedEspecialidadesForm } from "@/components/private/especialidades/combined-especialidades-form";
import { notFound } from "next/navigation";
import { cuestionarios } from "@/schema/cuestionarios";
import { instituciones } from "@/schema/instituciones";

type Params = Promise<{ cuestionarioId: string, id: string }>;

interface PageProps {
    params: {
        id: string;
        cuestionarioId: string;
    }
}

export default async function Page(props: { params: Params }) {
    const params = await props.params;

    const [institucion, cuestionario, especialidadesDatos, listaEspecialidades] = await Promise.all([
        db.query.instituciones.findFirst({
            where: eq(instituciones.id, params.id),
        }),
        db.query.cuestionarios.findFirst({
            where: eq(cuestionarios.id, params.cuestionarioId),
        }),
        db.query.especialidades.findMany({
            where: eq(especialidades.cuestionarioId, params.cuestionarioId),
        }),
        db.query.especialidadesListas.findMany(),
    ]);

    if (!institucion || !cuestionario) {
        notFound();
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Especialidades - {institucion.nombre} ({cuestionario.año})
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
                <CombinedEspecialidadesForm
                    existingEspecialidades={especialidadesDatos}
                    listaEspecialidades={listaEspecialidades}
                    cuestionarioId={cuestionario.id}
                    numeroCarreras={institucion?.numeroCarreras || 0}
                />
            </div>
        </div>
    );
}
