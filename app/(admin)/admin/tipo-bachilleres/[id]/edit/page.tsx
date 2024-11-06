import { notFound } from "next/navigation";
import { TipoBachillereUpdateForm } from "@/components/admin/tipo-bachilleres/tipo-bachillere-update-form";
import { getTipoBachillereWithRelations } from "@/repositories/tipo-bachillere-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const tipoBachillere = await getTipoBachillereWithRelations(id);

  if (!tipoBachillere) {
    notFound();
  }


  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Tipo Bachillere</h1>
      <TipoBachillereUpdateForm 
        tipoBachillere={ tipoBachillere }
      />
    </div>
  );
}
