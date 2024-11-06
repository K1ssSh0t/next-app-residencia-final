import { notFound } from "next/navigation";
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
      <h1 className="text-xl font-bold mb-6">Tipo Bachilleres</h1>
      <div>
        <p><strong>Id:</strong> { tipoBachillere.id }</p>
        <p><strong>Descripcion:</strong> { tipoBachillere.descripcion }</p>
      </div>
    </div>
  );
}
