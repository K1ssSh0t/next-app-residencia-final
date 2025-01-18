import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { cuestionarios } from "@/schema/cuestionarios";
import { especialidades } from "@/schema/especialidades";
import { CombinedEspecialidadesForm } from "@/components/private/especialidades/combined-especialidades-form";
import { instituciones } from "@/schema/instituciones";

export default async function Page() {
    const session = await auth();

    const misCuestionarios = await db.query.cuestionarios.findMany({
        where: eq(cuestionarios.usersId, `${session?.user?.id}`),
    });

    const misEspecialidades = await db.query.especialidades.findMany({
        where: eq(especialidades.cuestionarioId, `${misCuestionarios[0]?.id}`),
    });

    const listaEspecialidades = await db.query.especialidadesListas.findMany();

    const miInstitucion = await db.query.instituciones.findFirst({
        where: eq(instituciones.usersId, `${session?.user?.id}`)
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Datos Especialidades</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <CombinedEspecialidadesForm
                    existingEspecialidades={misEspecialidades}
                    listaEspecialidades={listaEspecialidades}
                    cuestionarioId={misCuestionarios[0]?.id}
                    numeroCarreras={miInstitucion?.numeroCarreras || 0}
                />
            </div>
        </div>
    );
}