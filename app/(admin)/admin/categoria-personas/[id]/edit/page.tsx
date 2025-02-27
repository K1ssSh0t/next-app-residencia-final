import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import { CategoriaPersonaUpdateForm } from "@/components/admin/categoria-personas/categoria-persona-update-form";
import { getCategoriaPersonaWithRelations } from "@/repositories/categoria-persona-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const categoriaPersona = await getCategoriaPersonaWithRelations(id);

  if (!categoriaPersona) {
    notFound();
  }


  return (

    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categoria-personas">Indicadores</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/categoria-personas/${categoriaPersona.id}`}>
                {categoriaPersona.id}
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
        <h1 className="text-xl font-bold">Editar Indicador</h1>
      <CategoriaPersonaUpdateForm
        categoriaPersona={categoriaPersona}
      />
    </div>
    </div>
  );
}
