import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DatosInstitucionaleDeleteForm } from "@/components/private/datos-institucionales/datos-institucionale-delete-form";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { datosInstitucionales } from "@/schema/datos-institucionales";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const datosInstitucionale = await db.query.datosInstitucionales.findFirst({ where: eq(datosInstitucionales.id, id) });

  if (!datosInstitucionale) {
    notFound();
  }

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
              <BreadcrumbPage>Delete</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <DatosInstitucionaleDeleteForm datosInstitucionale={ datosInstitucionale } />
      </div>
    </div>
  );
}
