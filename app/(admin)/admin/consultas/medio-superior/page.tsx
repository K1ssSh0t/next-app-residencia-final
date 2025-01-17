
import { FiltrosMedioSuperior } from "@/components/admin/consultas/filtros-medio-superior";
import { SearchInput } from "@/components/search-input";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import { getInstitutionWithRelations } from "@/repositories/optener-institucion-query";
import { getRegionsWithRelations } from "@/repositories/region-repository";
import { instituciones } from "@/schema/instituciones";
import { municipios } from "@/schema/municipios";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function Page(props: {
    searchParams: SearchParams;
}) {

    const searchParams = await props.searchParams;
    const { search } = searchParams;

    const regiones = await db.query.regiones.findMany();
    const tipoInstituciones = await db.query.tipoInstituciones.findMany();
    const municipios = await db.query.municipios.findMany();
    const tiposBachillerato = await db.query.tipoBachilleres.findMany();

    // Transformar regiones a formato value/label
    const regionesFormateadas = regiones.map(region => ({
        value: region.id,
        label: region.nombre
    }));

    // Transformar tipos de instituciones a formato value/label 
    const tiposInstitucionesFormateados = tipoInstituciones.map(tipo => ({
        value: tipo.id,
        label: tipo.descripcion
    }));

    // Transformar municipios a formato value/label
    const municipiosFormateados = municipios.map(municipio => ({
        value: municipio.id,
        label: municipio.nombre,
        regionId: municipio.regionId
    }));

    const tiposBachilleratoFormateados = tiposBachillerato.map(tipo => ({
        value: tipo.id,
        label: tipo.descripcion
    }));

    // Combinar ambos arrays en un solo objeto
    const datosFormateados = {
        regions: regionesFormateadas,
        institutionTypes: tiposInstitucionesFormateados,
        municipalities: municipiosFormateados,
        tiposBachillerato: tiposBachilleratoFormateados
    };

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
        <div className="">
            <div className="">

            </div>
            <div className="flex flex-col justify-between pt-5 mb-5">
                <div className="">
                    <FiltrosMedioSuperior filterOptions={datosFormateados} />
                </div>
                {/* <div className="w-2/3">
                    <SearchInput placeholder="Buscar Institución por nombre" />
                </div>
                <div className=" flex gap-2 m-2">

                    <Suspense key={search as string} fallback={<div>Cargando...</div>}>
                        <InstitutionResults institution={search as string} />
                    </Suspense>

                </div> */}
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
