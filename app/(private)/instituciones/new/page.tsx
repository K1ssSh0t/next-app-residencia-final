import { db } from "@/lib/db";
import { InstitucioneCreateForm } from "@/components/private/instituciones/institucione-create-form";
import { getUserWithRelations } from "@/repositories/user-repository";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  const tipoInstitucioneList = await db.query.tipoInstituciones.findMany();
  const tipoBachillereList = await db.query.tipoBachilleres.findMany();



  const usuario = await getUserWithRelations(session?.user.id)


  const regionList = await db.query.regiones.findMany();
  const municipioList = await db.query.municipios.findMany();


  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Rellena los datos de la Institucion</h1>
      <InstitucioneCreateForm
        tipoInstitucioneList={tipoInstitucioneList}
        tipoBachillereList={tipoBachillereList}
        nivelEducativo={usuario?.nivelEducativo as boolean}

        regionList={regionList}
        municipioList={municipioList}
      />
    </div>
  );
}
