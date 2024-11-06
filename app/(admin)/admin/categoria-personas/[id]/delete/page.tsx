import { CategoriaPersonaDeleteForm } from "@/components/admin/categoria-personas/categoria-persona-delete-form";
import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const categoriaPersona = await db.query.categoriaPersonas.findFirst({ where: eq(categoriaPersonas.id, id) });

  if (!categoriaPersona) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Categoria Persona</h1>
      <CategoriaPersonaDeleteForm categoriaPersona={ categoriaPersona } />
    </div>
  );
}
