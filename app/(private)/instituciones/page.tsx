import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { instituciones } from "@/schema/instituciones";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getUserWithRelations } from "@/repositories/user-repository";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {

  //TODO: HACER QUE SEGUN EL TIPO DE NIVEL RESTRINGIR QUE CAMPOS PUEDE LLENAR

  const session = await auth();

  const miInstitucion = await db.query.instituciones.findFirst(
    {
      with: {
        tipoBachilleres: true,
        tipoInstituciones: true
      },
      where: eq(instituciones.usersId, `${session?.user?.id}`)
    }
  )

  const usuario = await getUserWithRelations(session?.user?.id)

  /*
  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(instituciones);
  const totalPages = Math.ceil(count / pageSize);
  const institucioneList = await getInstitucionesWithRelations({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search,
  });

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
      <div>
        <InstitucioneTable institucioneList={ institucioneList } />
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />
      </div>
    </div>
  );*/

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Instituciones</h1>
      <div className="flex justify-between">
        <div>

        </div>
        <div className="text-right mr-2">

          {!miInstitucion ?
            <Link href="/instituciones/new">
              <Button>
                <PlusIcon className="mr-2" /> New
              </Button>
            </Link>
            : <div></div>}

        </div>
      </div>
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-6">Institucion</h1>

          {!miInstitucion ? <div>No tienes datos</div> : <div>
            <p><strong>Id:</strong> {miInstitucion.id}</p>
            <p><strong>Nombre:</strong> {miInstitucion.nombre?.toString()}</p>
            <p><strong>Region:</strong> {miInstitucion.region?.toString()}</p>
            <p><strong>Municipio:</strong> {miInstitucion.municipio?.toString()}</p>
            <p><strong>Tipo Institucion:</strong> {miInstitucion.tipoInstituciones?.descripcion?.toString()}</p>
            {!usuario?.nivelEducativo && (<p><strong>Tipo Bachiller:</strong> {miInstitucion.tipoBachilleres?.descripcion?.toString()}</p>)}
            <p><strong>Nivel Educativo:</strong> {miInstitucion.nivelEducativo ? "Superior" : "Medio Superior"}</p>
            <div> <Link href={`/instituciones/${miInstitucion.id}/edit`} >
              <Button>
                <PlusIcon className="mr-2" /> Editar
              </Button>
            </Link></div>
          </div>}

        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
