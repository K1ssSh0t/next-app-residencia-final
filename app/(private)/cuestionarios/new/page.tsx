import { db } from "@/lib/db";
import { CuestionarioCreateForm } from "@/components/private/cuestionarios/cuestionario-create-form";

export default async function Page() {
  const carreraList = await db.query.carreras.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Cuestionario</h1>
      <CuestionarioCreateForm 
        carreraList={ carreraList }
      />
    </div>
  );
}
