import { TipoInstitucioneDeleteForm } from "@/components/admin/tipo-instituciones/tipo-institucione-delete-form";
import { db } from "@/lib/db";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const tipoInstitucion = await db.query.tipoInstituciones.findFirst({ where: eq(tipoInstituciones.id, id) });

  if (!tipoInstitucion) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Tipoinstitucion</h1>
      <TipoInstitucioneDeleteForm tipoInstitucione={tipoInstitucion} />
    </div>
  );
}
