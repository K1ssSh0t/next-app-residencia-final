import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DatosInstitucionaleCreateForm } from "@/components/private/datos-institucionales/datos-institucionale-create-form";

export default async function Page() {
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
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <DatosInstitucionaleCreateForm 
          categoriasGeneraleList={ categoriasGeneraleList }
        />
      </div>
    </div>
  );
}
