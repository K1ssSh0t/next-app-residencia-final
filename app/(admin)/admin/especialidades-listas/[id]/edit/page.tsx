import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EspecialidadesListaUpdateForm } from "@/components/admin/especialidades-listas/especialidades-lista-update-form";
import { getEspecialidadesListaWithRelations } from "@/repositories/especialidades-lista-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const especialidadesLista = await getEspecialidadesListaWithRelations(id);

  if (!especialidadesLista) {
    notFound();
  }


  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/especialidades-listas">Catalogo Especialidades</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/especialidades-listas/${ especialidadesLista.id }`}>
                { especialidadesLista.id }
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
        <h1 className="text-xl font-bold">Editar Especialidad</h1>
        <EspecialidadesListaUpdateForm 
          especialidadesLista={ especialidadesLista }
        />
      </div>
    </div>
  );
}
