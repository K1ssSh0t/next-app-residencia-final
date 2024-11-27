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
import { DatosInstitucionaleUpdateForm } from "@/components/private/datos-institucionales/datos-institucionale-update-form";
import { getDatosInstitucionaleWithRelations } from "@/repositories/datos-institucionale-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const datosInstitucionale = await getDatosInstitucionaleWithRelations(id);

  if (!datosInstitucionale) {
    notFound();
  }

  const categoriasGeneraleList = await db.query.categoriasGenerales.findMany();

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/datos-institucionales">Datos Institucionales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/datos-institucionales/${ datosInstitucionale.id }`}>
                { datosInstitucionale.id }
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
        <DatosInstitucionaleUpdateForm 
          datosInstitucionale={ datosInstitucionale }
          categoriasGeneraleList={ categoriasGeneraleList }
        />
      </div>
    </div>
  );
}
