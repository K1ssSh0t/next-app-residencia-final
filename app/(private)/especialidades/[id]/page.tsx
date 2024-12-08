import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getEspecialidadWithRelations } from "@/repositories/especialidad-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const especialidad = await getEspecialidadWithRelations(id);

  if (!especialidad) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/especialidades">Especialidades</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{especialidad.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <p><strong>Nombre:</strong> {especialidad.nombre}</p>
        <p><strong>Hombres:</strong> {especialidad.hombres}</p>
        <p><strong>Mujeres:</strong> {especialidad.mujeres}</p>
        <p><strong>Cuestionario Id:</strong> {especialidad.cuestionarioId}</p>
      </div>
    </div>
  );
}
