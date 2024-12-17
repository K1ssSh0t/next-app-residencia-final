import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { categoriasGenerales } from "@/schema/categorias-generales";
import { CategoriasGeneraleTable } from "@/components/admin/categorias-generales/categorias-generale-table";
import { getCategoriasGeneralesWithRelations } from "@/repositories/categorias-generale-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(categoriasGenerales);
  const totalPages = Math.ceil(count / pageSize);
  const categoriasGeneraleList = await getCategoriasGeneralesWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Categorias Generales</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between pt-5 mb-5">
        <div>
          <SearchInput placeholder="Search Categorias Generales" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/categorias-generales/new">
            <Button>
              <PlusIcon className="mr-2" /> Agregar
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-5">
        <CategoriasGeneraleTable categoriasGeneraleList={categoriasGeneraleList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
