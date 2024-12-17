import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { TipoBachillereTable } from "@/components/admin/tipo-bachilleres/tipo-bachillere-table";
import { getTipoBachilleresWithRelations } from "@/repositories/tipo-bachillere-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(tipoBachilleres);
  const totalPages = Math.ceil(count / pageSize);
  const tipoBachillereList = await getTipoBachilleresWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Tipos de  Bachilleres</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Tipo Bachilleres" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/tipo-bachilleres/new">
            <Button>
              <PlusIcon className="mr-2" /> Agregar
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <TipoBachillereTable tipoBachillereList={tipoBachillereList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
