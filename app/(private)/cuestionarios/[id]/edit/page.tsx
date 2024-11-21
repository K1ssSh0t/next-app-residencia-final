import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CuestionarioUpdateForm } from "@/components/private/cuestionarios/cuestionario-update-form";
import { getCuestionarioWithRelations } from "@/repositories/cuestionario-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const cuestionario = await getCuestionarioWithRelations(id);

  if (!cuestionario) {
    notFound();
  }

  const carreraList = await db.query.carreraInstituciones.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Cuestionario</h1>
      <CuestionarioUpdateForm
        cuestionario={cuestionario}
        carreraList={carreraList}
      />
    </div>
  );
}
