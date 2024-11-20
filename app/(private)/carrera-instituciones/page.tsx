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
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { CarreraInstitucionTable } from "@/components/private/carrera-institucions/carrera-institucion-table";
import { getCarreraInstitucionsWithRelations } from "@/repositories/carrera-institucion-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(carreraInstituciones);
  const totalPages = Math.ceil(count / pageSize);
  const carreraInstitucionList = await getCarreraInstitucionsWithRelations({
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
              <BreadcrumbPage>Carrera Institucions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-between pt-5 mb-5">
        <div>
          <SearchInput placeholder="Search Carrera Institucions" />
        </div>
        <div className="text-right mr-2">
          <Link href="/carrera-instituciones/new">
            <Button>
              <PlusIcon className="mr-2" /> New
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-5">
        <CarreraInstitucionTable carreraInstitucionList={carreraInstitucionList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
