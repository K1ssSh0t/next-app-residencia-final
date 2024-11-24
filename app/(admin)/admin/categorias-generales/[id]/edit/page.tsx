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
  const categoriasGenerale = await getCategoriasGeneraleWithRelations(id);

  if (!categoriasGenerale) {
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
              <BreadcrumbLink href={`/admin/categorias-generales/${ categoriasGenerale.id }`}>
                { categoriasGenerale.id }
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
        <CategoriasGeneraleUpdateForm 
          categoriasGenerale={ categoriasGenerale }
        />
      </div>
    </div>
  );
}
