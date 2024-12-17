import { InstitucioneDeleteForm } from "@/components/private/instituciones/institucione-delete-form";
import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const institucion = await db.query.instituciones.findFirst({ where: eq(instituciones.id, id) });

  if (!institucion) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Deleteinstitucion</h1>
      <InstitucioneDeleteForm institucion={institucion} />
    </div>
  );
}
