import { TipoBachillereDeleteForm } from "@/components/admin/tipo-bachilleres/tipo-bachillere-delete-form";
import { db } from "@/lib/db";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const tipoBachillere = await db.query.tipoBachilleres.findFirst({ where: eq(tipoBachilleres.id, id) });

  if (!tipoBachillere) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Delete Tipo Bachillere</h1>
      <TipoBachillereDeleteForm tipoBachillere={ tipoBachillere } />
    </div>
  );
}
