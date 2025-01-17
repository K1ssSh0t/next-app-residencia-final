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
              <BreadcrumbLink href="/admin/especialidades-listas">Especialidades Listas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/especialidades-listas/${ especialidadesLista.id }`}>
                { especialidadesLista.id }
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <EspecialidadesListaUpdateForm 
          especialidadesLista={ especialidadesLista }
        />
      </div>
    </div>
  );
}
