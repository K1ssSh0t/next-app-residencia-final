import { CarreraDeleteForm } from "@/components/admin/carreras/carrera-delete-form";
import { db } from "@/lib/db";
import { carreras } from "@/schema/carreras";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const carrera = await db.query.carreras.findFirst({ where: eq(carreras.id, id) });

  if (!carrera) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Carrera</h1>
      <CarreraDeleteForm carrera={ carrera } />
    </div>
  );
}
