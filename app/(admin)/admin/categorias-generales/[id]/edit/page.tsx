import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CategoriasGeneraleUpdateForm } from "@/components/admin/categorias-generales/categorias-generale-update-form";
import { getCategoriasGeneraleWithRelations } from "@/repositories/categorias-generale-repository";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const categoriasGenerales = await getCategoriasGeneraleWithRelations(id);

  if (!categoriasGenerales) {
    notFound();
  }


  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categorias-generales">Categorias Generales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/categorias-generales/${categoriasGenerales.id}`}>
                {categoriasGenerales.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5 flex flex-col gap-5 w-full sm:w-4/5 md:w-3/5 lg:w-2/5">
        <h1 className="text-xl font-bold">Editar Categoría General</h1>
        <CategoriasGeneraleUpdateForm
          categoriasGenerales={categoriasGenerales}
        />
      </div>
    </div>
  );
}
