import { CuestionarioDeleteForm } from "@/components/private/cuestionarios/cuestionario-delete-form";
import { db } from "@/lib/db";
import { cuestionarios } from "@/schema/cuestionarios";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const cuestionario = await db.query.cuestionarios.findFirst({ where: eq(cuestionarios.id, id) });

  if (!cuestionario) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Cuestionario</h1>
      <CuestionarioDeleteForm cuestionario={ cuestionario } />
    </div>
  );
}
