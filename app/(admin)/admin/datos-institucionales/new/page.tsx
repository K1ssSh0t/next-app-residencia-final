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
import { DatosInstitucionaleCreateForm } from "./datos-generales-create-new-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function Page(props: { searchParams: SearchParams }) {
  const categoriasGeneraleList = await db.query.categoriasGenerales.findMany();

  const searchParams = await props.searchParams;
  const { idInstitucion } = searchParams

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/datos-institucionales">Datos Institucionales</BreadcrumbLink>
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
        <DatosInstitucionaleCreateForm
          categoriasGeneraleList={categoriasGeneraleList}
          idInstitucion={idInstitucion as string}
        />
      </div>
    </div>
  );
}
