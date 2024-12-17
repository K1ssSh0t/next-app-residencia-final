import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { carreras } from "@/schema/carreras";
import { CarreraTable } from "@/components/admin/carreras/carrera-table";
import { getCarrerasWithRelations } from "@/repositories/carrera-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(carreras);
  const totalPages = Math.ceil(count / pageSize);
  const carreraList = await getCarrerasWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Carreras</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Carreras" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/carreras/new">
            <Button>
              <PlusIcon className="mr-2" /> Nueva Carrera
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <CarreraTable carreraList={carreraList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
