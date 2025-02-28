import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CategoriaPersonaCreateForm } from "@/components/admin/categoria-personas/categoria-persona-create-form";

export default async function Page() {
  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categoria-personas">Indicadores</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nuevo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Contenido principal */}
      <div className="pt-5 flex flex-col gap-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-xl font-bold">Crear Indicador</h1>
        <CategoriaPersonaCreateForm />
      </div>
    </div>
  );
}