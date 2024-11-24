import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { CategoriasGeneraleDeleteForm } from "@/components/admin/categorias-generales/categorias-generale-delete-form";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categoriasGenerales } from "@/schema/categorias-generales";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const categoriasGenerale = await db.query.categoriasGenerales.findFirst({ where: eq(categoriasGenerales.id, id) });

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
              <BreadcrumbPage>Delete</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <CategoriasGeneraleDeleteForm categoriasGenerale={ categoriasGenerale } />
      </div>
    </div>
  );
}
