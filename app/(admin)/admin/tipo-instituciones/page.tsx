import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { TipoInstitucioneTable } from "@/components/admin/tipo-instituciones/tipo-institucione-table";
import { getTipoInstitucionesWithRelations } from "@/repositories/tipo-institucione-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(tipoInstituciones);
  const totalPages = Math.ceil(count / pageSize);
  const tipoInstitucioneList = await getTipoInstitucionesWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Tipos de  Instituciones</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Tipo Instituciones" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/tipo-instituciones/new">
            <Button>
              <PlusIcon className="mr-2" /> Agregar
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <TipoInstitucioneTable tipoInstitucioneList={tipoInstitucioneList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
