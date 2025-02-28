import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import { TipoInstitucioneUpdateForm } from "@/components/admin/tipo-instituciones/tipo-institucione-update-form";
import { getTipoInstitucioneWithRelations } from "@/repositories/tipo-institucione-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const tipoInstitucion = await getTipoInstitucioneWithRelations(id);

  if (!tipoInstitucion) {
    notFound();
  }


  return (

    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/tipo-instituciones">Tipo Instituciones</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/tipo-instituciones/${tipoInstitucion.id}`}>
                {tipoInstitucion.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    
<div className="pt-5 flex flex-col gap-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
<h1 className="text-xl font-bold">Editar Tipo Institución</h1>
      <TipoInstitucioneUpdateForm
        tipoInstitucione={tipoInstitucion}
      />
    </div>
    </div>
  );
}
