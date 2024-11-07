import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { cuestionarios } from "@/schema/cuestionarios";
import { CuestionarioTable } from "@/components/private/cuestionarios/cuestionario-table";
import { getCuestionariosWithRelations } from "@/repositories/cuestionario-repository";
import { eq } from "drizzle-orm";
import { instituciones } from "@/schema/instituciones";
import { auth } from "@/lib/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {

  const session = await auth();


  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(cuestionarios);
  const totalPages = Math.ceil(count / pageSize);
  /*const cuestionarioList = await getCuestionariosWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });
*/


  const misCuestionarios = await db.query.cuestionarios.findMany({
    with: {
      carrera: true,
    },
    limit: pageSize,
    offset: pageIndex * pageSize,
    where: eq(cuestionarios.usersId, `${session?.user?.id}`),
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Cuestionarios</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Cuestionarios" />
        </div>
        <div className="text-right mr-2">
          <Link href="/cuestionarios/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <CuestionarioTable cuestionarioList={misCuestionarios} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
