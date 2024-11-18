import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MunicipioUpdateForm } from "@/components/admin/municipios/municipio-update-form";
import { getMunicipioWithRelations } from "@/repositories/municipio-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const municipio = await getMunicipioWithRelations(id);

  if (!municipio) {
    notFound();
  }

  const regionList = await db.query.regions.findMany();

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/municipios">Municipios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/municipios/${ municipio.id }`}>
                { municipio.id }
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <MunicipioUpdateForm 
          municipio={ municipio }
          regionList={ regionList }
        />
      </div>
    </div>
  );
}
