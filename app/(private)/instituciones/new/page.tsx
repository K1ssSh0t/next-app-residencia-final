import { db } from "@/lib/db";
import { InstitucioneCreateForm } from "@/components/private/instituciones/institucione-create-form";

export default async function Page() {
  const tipoInstitucioneList = await db.query.tipoInstituciones.findMany();
  const tipoBachillereList = await db.query.tipoBachilleres.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Institucione</h1>
      <InstitucioneCreateForm 
        tipoInstitucioneList={ tipoInstitucioneList }
        tipoBachillereList={ tipoBachillereList }
      />
    </div>
  );
}
