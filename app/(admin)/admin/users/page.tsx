import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { users } from "@/schema/users";
import { UserTable } from "@/components/admin/users/user-table";
import { getUsersWithRelations } from "@/repositories/user-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(users);
  const totalPages = Math.ceil(count / pageSize);
  const userList = await getUsersWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Usuarios</h1>
      <div className="flex justify-between">
        <div>
          <SearchInput placeholder="Search Users" />
        </div>
        <div className="text-right mr-2">
          <Link href="/admin/users/new">
            <Button>
              <PlusIcon className="mr-2" /> Nuevo
            </Button>
          </Link>
        </div>
      </div>
      <div>
        {/* 
          TODO: AGREGAR UNA TABLA QUE GUARDE JSON PARA LOS DATOS HISTORICOS AL TERMINAR UN CICLO 
        */}
        <UserTable userList={userList} />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );
}
