import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { CategoriaPersonaTable } from "@/components/admin/categoria-personas/categoria-persona-table";
import { getCategoriaPersonasWithRelations } from "@/repositories/categoria-persona-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(categoriaPersonas);
  const totalPages = Math.ceil(count / pageSize);
  const categoriaPersonaList = await getCategoriaPersonasWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Indicadores</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Categoria Personas" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/categoria-personas/new">
            <Button>
              <PlusIcon className="mr-2" /> Nuevo Indicador
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <CategoriaPersonaTable categoriaPersonaList={categoriaPersonaList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
