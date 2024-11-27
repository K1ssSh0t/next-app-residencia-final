import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InstitucioneUpdateForm } from "@/components/private/instituciones/institucione-update-form";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";
import { auth } from "@/lib/auth";
import { getUserWithRelations } from "@/repositories/user-repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const session = await auth();

  const params = await props.params;
  const { id } = params;
  const institucion = await getInstitucioneWithRelations(id);

  if (!institucion) {
    notFound();
  }

  const tipoInstitucioneList = await db.query.tipoInstituciones.findMany();
  const tipoBachillereList = await db.query.tipoBachilleres.findMany();

  const usuario = await getUserWithRelations(session?.user.id)


  const regionList = await db.query.regions.findMany();
  const municipioList = await db.query.municipios.findMany();




  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Institución</CardTitle>
        </CardHeader>
        <CardContent>
          <InstitucioneUpdateForm
            institucione={institucion}
            tipoInstitucioneList={tipoInstitucioneList}
            tipoBachillereList={tipoBachillereList}
            nivelEducativo={institucion.nivelEducativo as boolean}

            regionList={regionList}
            municipioList={municipioList}
          />
        </CardContent>
      </Card>
    </div>
  );
}
