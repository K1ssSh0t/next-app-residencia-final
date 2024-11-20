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

export default async function Page() {
  const carreraList = await db.query.carreras.findMany();
  const modalidadeList = await db.query.modalidads.findMany();

  return (
    <div className="relative">
      <div className="absolute left-8 -top-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/carrera-institucions">Carrera Institucions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-5">
        <CarreraInstitucionCreateForm
          carreraList={carreraList}
          modalidadeList={modalidadeList}
        />
      </div>
    </div>
  );
}
