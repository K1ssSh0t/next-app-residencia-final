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
import { municipios } from "@/schema/municipios";
import { MunicipioTable } from "@/components/admin/municipios/municipio-table";
import { getMunicipiosWithRelations } from "@/repositories/municipio-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(municipios);
  const totalPages = Math.ceil(count / pageSize);
  const municipioList = await getMunicipiosWithRelations({
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
              <BreadcrumbPage>Municipios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between pt-5 mb-5">
        <div>
          <SearchInput placeholder="Search Municipios" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/municipios/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-5">
        <MunicipioTable municipioList={ municipioList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
