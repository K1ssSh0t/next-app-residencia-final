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
import { especialidadesListas } from "@/schema/especialidades-listas";
import { EspecialidadesListaTable } from "@/components/admin/especialidades-listas/especialidades-lista-table";
import { getEspecialidadesListasWithRelations } from "@/repositories/especialidades-lista-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(especialidadesListas);
  const totalPages = Math.ceil(count / pageSize);
  const especialidadesListaList = await getEspecialidadesListasWithRelations({
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
              <BreadcrumbPage className="text-xl font-bold"> Catalogo Especialidades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between pt-5 mb-5">
        <div>
          <SearchInput placeholder="Buscar Especialidades " />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/especialidades-listas/new">
            <Button>
              <PlusIcon className="mr-2" /> Agregar
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-5">
        <EspecialidadesListaTable especialidadesListaList={especialidadesListaList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
