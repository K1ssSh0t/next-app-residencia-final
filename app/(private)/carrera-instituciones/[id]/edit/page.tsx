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
import { CarreraInstitucionUpdateForm } from "@/components/private/carrera-institucions/carrera-institucion-update-form";
import { getCarreraInstitucionWithRelations } from "@/repositories/carrera-institucion-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const carreraInstitucion = await getCarreraInstitucionWithRelations(id);

  if (!carreraInstitucion) {
    notFound();
  }

  const carreraList = await db.query.carreras.findMany();
  const modalidadeList = await db.query.modalidades.findMany();

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instituciones">Carrera Instituciones</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/carrera-institucions/${carreraInstitucion.id}`}>
                {carreraInstitucion.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5 w-2/5">
        <CarreraInstitucionUpdateForm
          carreraInstitucion={carreraInstitucion}
          carreraList={carreraList}
          modalidadeList={modalidadeList}
        />
      </div>
    </div>
  );
}
