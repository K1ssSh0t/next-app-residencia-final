import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import { CarreraUpdateForm } from "@/components/admin/carreras/carrera-update-form";
import { getCarreraWithRelations } from "@/repositories/carrera-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const carrera = await getCarreraWithRelations(id);

  if (!carrera) {
    notFound();
  }


  return (
    <div className="relative">
      {/* Breadcrumb */}
    <div className="absolute left-8 -top-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/carreras">Carreras</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/carreras/${carrera.id}`}>
              {carrera.id}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Editar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

      {/* Contenido principal */}
      <div className="pt-5 flex flex-col gap-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-xl font-bold">Editar Carrera</h1>
      <CarreraUpdateForm
        carrera={carrera}
      />
    </div>
    </div>
  );
}
