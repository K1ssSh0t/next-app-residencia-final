import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { EspecialidadesListaDeleteForm } from "@/components/admin/especialidades-listas/especialidades-lista-delete-form";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { especialidadesListas } from "@/schema/especialidades-listas";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const especialidadesLista = await db.query.especialidadesListas.findFirst({ where: eq(especialidadesListas.id, id) });

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
              <BreadcrumbPage>Eliminar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <EspecialidadesListaDeleteForm especialidadesLista={ especialidadesLista } />
      </div>
    </div>
  );
}
