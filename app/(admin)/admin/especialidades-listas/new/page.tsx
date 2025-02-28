import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EspecialidadesListaCreateForm } from "@/components/admin/especialidades-listas/especialidades-lista-create-form";

export default async function Page() {
  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/especialidades-listas">Catalogo Especialidades</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nueva</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Contenido principal */}
      <div className="pt-5 flex flex-col gap-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-xl font-bold">Crear Especialidad</h1>
        <EspecialidadesListaCreateForm />
      </div>
    </div>
  );
}