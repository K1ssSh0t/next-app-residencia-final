import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDatosInstitucionaleWithRelations } from "@/repositories/datos-institucionale-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;

  const datosInstitucionale = await getDatosInstitucionaleWithRelations(id);

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
              <BreadcrumbPage>{ datosInstitucionale.id }</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <p><strong>Instituciones Id:</strong> { datosInstitucionale.institucionesId }</p>
        <p><strong>Categorias Generales Id:</strong> { datosInstitucionale.categoriasGeneralesId }</p>
        <p><strong>Cantidad Hombres:</strong> { datosInstitucionale.cantidadHombres }</p>
        <p><strong>Cantidad Mujeres:</strong> { datosInstitucionale.cantidadMujeres }</p>
      </div>
    </div>
  );
}
