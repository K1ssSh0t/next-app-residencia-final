import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { instituciones } from "@/schema/instituciones";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { getUserWithRelations } from "@/repositories/user-repository";
import { parseSearchParams } from "@/lib/search-params-utils";
import { cuestionarios } from "@/schema/cuestionarios";
import { CuestionarioTable } from "@/components/private/cuestionarios/cuestionario-table";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  searchParams: SearchParams;
}) {

  const searchParams = await props.searchParams;
  const { page, pageIndex, pageSize, search } = parseSearchParams(searchParams);
  const count = await db.$count(cuestionarios);
  const totalPages = Math.ceil(count / pageSize);
  //TODO: HACER QUE SEGUN EL TIPO DE NIVEL RESTRINGIR QUE CAMPOS PUEDE LLENAR

  const session = await auth();

  const miInstitucion = await db.query.instituciones.findFirst(
    {
      with: {
        tipoBachilleres: true,
        tipoInstituciones: true,
        municipio: true,
        region: true,


      },
      where: eq(instituciones.usersId, `${session?.user?.id}`)
    }
  )

  const usuario = await getUserWithRelations(session?.user?.id)

  const estadoCuestionario = await db.query.helpers.findFirst();


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
  if (estadoCuestionario?.estadoCuestionario == false) {
    return (<div className="flex flex-col gap-5">
      <p className="text-xl font-bold">El cuestionario no esta activo</p>
    </div>)
  }

  const misCuestionarios = await db.query.cuestionarios.findMany({
    with: {
      carrera: {
        with: {
          modalidade: true,
          carrera: true,
        }
      },
    },
    limit: pageSize,
    offset: pageIndex * pageSize,
    where: eq(cuestionarios.usersId, `${session?.user?.id}`),
  });


  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Datos de Institución</h1>
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
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Institución</CardTitle>
          </CardHeader>
          <CardContent>
            {!miInstitucion ? (
              <><div className="text-center text-muted-foreground">No tienes datos</div><Link href="/instituciones/new">
                <Button>
                  <PlusIcon className="mr-2" /> Rellenar Datos
                </Button>
              </Link></>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold mb-2">{miInstitucion.nombre?.toString()}</h2>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Región</p>
                  <p>{miInstitucion.region?.nombre?.toString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Municipio</p>
                  <p>{miInstitucion.municipio?.nombre?.toString()}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo Institución</p>
                  <p>{miInstitucion.tipoInstituciones?.descripcion?.toString()}</p>
                </div>
                {!usuario?.nivelEducativo && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo Bachiller</p>
                    <p>{miInstitucion.tipoBachilleres?.descripcion?.toString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nivel Educativo</p>
                  <p>{miInstitucion.nivelEducativo ? "Superior" : "Medio Superior"}</p>
                </div>
              </div>
            )}
          </CardContent>
          {miInstitucion && (
            <CardFooter className="flex justify-end">
              <Link href={`/instituciones/${miInstitucion.id}/edit`}>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" /> Editar Datos de la Institución
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
      <div>

      </div>
      <div>
        {/* {misCuestionarios.length > 0 ? <CuestionarioTable cuestionarioList={misCuestionarios} /> : <div>No tienes cuestionarios</div>} */}
        {

          // TODO:MODIFICAR PARA QUE TE DEJER ACREAGAR NUVEAS CARRERAS SEGUN UN NUMERO ESPECIFICADO
          // TALVEZ DE LA TABLAD DE INSITUCION PONER SU CANTIDAD DE CARRERAS QUE TIENE ????
          misCuestionarios.length > 0 && miInstitucion ? <CuestionarioTable cuestionarioList={misCuestionarios} /> : misCuestionarios.length == 0 && miInstitucion ? <><div>No tienes cuestionarios. Rellena los datos</div><Link href={{ pathname: "/carrera-instituciones/new", query: { idInstitucion: miInstitucion.id } }}>
            <Button>
              <PlusIcon className="mr-2" /> Agrega tus Carreras
            </Button>
          </Link></> : <div>No tienes datos.</div>
        }
      </div>
      <div>
        <Pagination page={page} pageSize={pageSize} totalPages={totalPages} />

      </div>
    </div >
  );
}
