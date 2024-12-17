import { db } from "@/lib/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CarreraInstitucionCreateForm } from "@/components/private/carrera-institucions/carrera-institucion-create-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;


export default async function Page(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const { idInstitucion } = searchParams
  const carreraList = await db.query.carreras.findMany();
  const modalidadeList = await db.query.modalidades.findMany();

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/carrera-institucions">Carreras de la Institución</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nueva</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5 w-1/2">
        <CarreraInstitucionCreateForm
          carreraList={carreraList}
          modalidadeList={modalidadeList}
          idInstitucion={idInstitucion as string}
        />
      </div>
    </div>
  );
}
