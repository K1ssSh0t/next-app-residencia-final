import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InstitucioneUpdateForm } from "@/components/private/instituciones/institucione-update-form";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";
import { auth } from "@/lib/auth";
import { getUserWithRelations } from "@/repositories/user-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const session = await auth();

  const params = await props.params;
  const { id } = params;
  const institucione = await getInstitucioneWithRelations(id);

  if (!institucione) {
    notFound();
  }

  const tipoInstitucioneList = await db.query.tipoInstituciones.findMany();
  const tipoBachillereList = await db.query.tipoBachilleres.findMany();

  const usuario = await getUserWithRelations(session?.user.id)

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edita los Datos de la Institucion</h1>
      <InstitucioneUpdateForm
        institucione={institucione}
        tipoInstitucioneList={tipoInstitucioneList}
        tipoBachillereList={tipoBachillereList}
        nivelEducativo={usuario?.nivelEducativo as boolean}
      />
    </div>
  );
}
