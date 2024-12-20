import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { parseSearchParams } from "@/lib/search-params-utils";
import { instituciones } from "@/schema/instituciones";
import { InstitucioneTable } from "@/components/private/instituciones/institucione-table";
import { getInstitucionesWithRelations } from "@/repositories/institucione-repository";
import { auth } from "@/lib/auth";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { eq, like } from "drizzle-orm";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
    searchParams: SearchParams;
}) {



    const searchParams = await props.searchParams;
    const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
    const count = await db.$count(instituciones);
    const totalPages = Math.ceil(count / pageSize);
    // const institucioneList = await getInstitucionesWithRelations({
    //     with: {
    //         tipoBachilleres: true,
    //         tipoInstituciones: true,
    //     },
    //     limit: pageSize,
    //     offset: pageIndex * pageSize,
    //     search: search,
    // });

    const institucioneList = await db.query.instituciones.findMany({
        limit: pageSize,
        offset: pageIndex * pageSize,
        where: search ? like(instituciones.id, `%${search}%`) : undefined,
        with: {
            tipoBachilleres: true,
            tipoInstituciones: true,
            region: true,
            municipio: true,
            user: true,

        },
    });

    const medioSuperiorInstituciones = institucioneList.filter(
        institucion => institucion.nivelEducativo === false
    );
    const superiorInstituciones = institucioneList.filter(
        institucion => institucion.nivelEducativo === true
    );

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl font-bold">Instituciones</h1>
            <div className="flex justify-between">
                <div>
                    <SearchInput placeholder="Search Instituciones" />
                </div>
                <div className="text-right mr-2">
                    <Link href="/instituciones/new">
                        <Button>
                            <PlusIcon className="mr-2" /> New
                        </Button>
                    </Link>
                </div>
            </div>
            <Tabs defaultValue="medio-superior" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="medio-superior">Medio Superior</TabsTrigger>
                    <TabsTrigger value="superior">Superior</TabsTrigger>
                </TabsList>
                <TabsContent value="medio-superior">
                    <InstitucioneTable institucioneList={medioSuperiorInstituciones} />
                </TabsContent>
                <TabsContent value="superior">
                    <InstitucioneTable institucioneList={superiorInstituciones} />
                </TabsContent>
            </Tabs>
            <div>
                <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
            </div>
        </div>
    );


}
