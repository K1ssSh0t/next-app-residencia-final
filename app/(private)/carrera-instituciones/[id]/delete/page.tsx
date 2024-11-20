import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CarreraInstitucionDeleteForm } from "@/components/private/carrera-institucions/carrera-institucion-delete-form";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { carreraInstituciones } from "@/schema/carrera-institucions";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const carreraInstitucion = await db.query.carreraInstituciones.findFirst({ where: eq(carreraInstituciones.id, id) });

  if (!carreraInstitucion) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/carrera-institucions">Carrera Institucions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/carrera-institucions/${carreraInstitucion.id}`}>
                {carreraInstitucion.id}
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
        <CarreraInstitucionDeleteForm carreraInstitucion={carreraInstitucion} />
      </div>
    </div>
  );
}
