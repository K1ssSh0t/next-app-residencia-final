import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { preguntas } from "@/schema/preguntas";
import { PreguntaTable } from "@/components/private/preguntas/pregunta-table";
import { getPreguntasWithRelations } from "@/repositories/pregunta-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(preguntas);
  const totalPages = Math.ceil(count / pageSize);
  const preguntaList = await getPreguntasWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Preguntas</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Preguntas" />
        </div>
        <div className="text-right mr-2">
          <Link href="/preguntas/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <PreguntaTable preguntaList={ preguntaList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
