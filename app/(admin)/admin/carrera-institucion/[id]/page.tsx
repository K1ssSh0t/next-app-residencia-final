import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCarreraInstitucionWithRelations } from "@/repositories/carrera-institucion-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const carreraInstitucion = await getCarreraInstitucionWithRelations(id);

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
              <BreadcrumbPage>{ carreraInstitucion.id }</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <p><strong>Instituciones Id:</strong> { carreraInstitucion.institucionesId }</p>
        <p><strong>Carreras Id:</strong> { carreraInstitucion.carrerasId }</p>
        <p><strong>Nombre Revoe:</strong> { carreraInstitucion.nombreRevoe }</p>
        <p><strong>Plan De Estudio:</strong> { carreraInstitucion.planDeEstudio }</p>
        <p><strong>Modalidades Id:</strong> { carreraInstitucion.modalidadesId }</p>
        <p><strong>Numero Revoe:</strong> { carreraInstitucion.numeroRevoe }</p>
      </div>
    </div>
  );
}
