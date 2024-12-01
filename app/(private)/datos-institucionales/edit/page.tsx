import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { DatosInstitucionaleCreateForm } from "@/components/private/datos-institucionales/datos-institucionale-create-form";
import { DatosInstitucionalesUpdateForm } from "./datos-generales-update-new-form";
import { eq } from "drizzle-orm";
import { datosInstitucionales } from "@/schema/datos-institucionales";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function Page(props: { searchParams: SearchParams }) {
  const categoriasGeneraleList = await db.query.categoriasGenerales.findMany();

  const searchParams = await props.searchParams;
  const { idInstitucion } = searchParams

  const datosGenerales = await db.query.datosInstitucionales.findMany({
    with: {
      categoriasGenerale: true,
    },
    where: eq(datosInstitucionales.institucionesId, `${idInstitucion}`)
  })


  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instituciones">Datos Institucionales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nuevo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        {/* <DatosInstitucionaleCreateForm
          categoriasGeneraleList={categoriasGeneraleList}
        /> */}
        <DatosInstitucionalesUpdateForm
          categoriasGeneraleList={categoriasGeneraleList}
          idInstitucion={idInstitucion as string}
          datosInstitucionales={datosGenerales}
        />
      </div>
    </div>
  );
}
