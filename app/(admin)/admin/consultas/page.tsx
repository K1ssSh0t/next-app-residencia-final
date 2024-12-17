import { InstitutionResults } from "@/components/admin/consultas/busqueda-institucion";
import { SearchInput } from "@/components/search-input";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { getInstitutionWithRelations } from "@/repositories/optener-institucion-query";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function Page(props: {
    searchParams: SearchParams;
}) {

    const searchParams = await props.searchParams;
    const { search } = searchParams;

    // export default function Page() {
    //     const [searchTerm, setSearchTerm] = useState("");

    //     const handleSearch = (term: string) => {
    //         setSearchTerm(term);
    //     };
    // const institution = search
    //     ? await (async () => {
    //         await new Promise(resolve => setTimeout(resolve, 5000));
    //         return await getInstitutionWithRelations(search as string);
    //     })()
    //     : undefined;

    // const institution = await getInstitutionWithRelations(search as string);


    return (
        <div className="relative">
            <div className="absolute left-8 -top-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Consultas</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex justify-between pt-5 mb-5">
                <div>
                    <SearchInput />
                </div>
                <div>

                    <Suspense key={search as string} fallback={<div>Loading...</div>}>
                        <InstitutionResults institution={search as string} />
                    </Suspense>

                </div>
                <div className="text-right mr-2">

                </div>
            </div>
            <div className="mb-5">

            </div>
            <div>

            </div>
        </div>
    );
}
