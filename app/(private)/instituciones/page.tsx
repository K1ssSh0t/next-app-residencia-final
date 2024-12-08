import Link from "next/link";
import { DivideCircle, PlusIcon, UserIcon, UsersIcon } from "lucide-react";
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
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { especialidades } from "@/schema/especialidades";
import { EspecialidadCreateForm } from "@/components/private/especialidades/especialidad--nuevo-create-form";
import { EspecialidadUpdateForm } from "@/components/private/especialidades/especialidad-update-form";

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
    return (
      <div className="p-4">
        <p className="text-lg font-semibold text-red-500">El cuestionario no está activo</p>
      </div>
    );
  }

  const misCuestionarios = await db.query.cuestionarios.findMany({
    with: {
      carrera: {
        with: {
          modalidad: true,
          carrera: true,
        }
      },
    },
    limit: pageSize,
    offset: pageIndex * pageSize,
    where: eq(cuestionarios.usersId, `${session?.user?.id}`),
  });

  const datosGenerales = await db.query.datosInstitucionales.findMany({
    with: {
      categoriasGenerales: true,
    },
    where: eq(datosInstitucionales.institucionesId, `${miInstitucion?.id}`),
  })

  const misEspecialidades = await db.query.especialidades.findMany({
    where: eq(especialidades.cuestionarioId, `${misCuestionarios[0].id}`),
  })


  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between ">
        <h1 className="text-xl font-bold">Datos de Institución</h1>
        {/* {!miInstitucion && (
        <Link href="/instituciones/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </Link>
      )} */}
      </div>
      <div className="grid gap-3 md:grid-cols-3">

        {/* <div className="md:col-span-1"></div> */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2">
            {!miInstitucion ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">No tienes datos</p>
                <Link href="/instituciones/new">
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" /> Rellenar Datos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-2 text-sm">
                <div className="border-b pb-1">
                  <h2 className="font-semibold text-base">{miInstitucion.nombre}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1.5">                  <div>
                  <span className="text-muted-foreground">Clave Institución:</span>
                  <p className="font-medium">{miInstitucion.claveInstitucion}</p>
                </div>
                  <div>
                    <span className="text-muted-foreground">Clave Centro Trabajo:</span>
                    <p className="font-medium">{miInstitucion.claveCentroTrabajo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Región:</span>
                    <p className="font-medium">{miInstitucion.region?.nombre}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Municipio:</span>
                    <p className="font-medium">{miInstitucion.municipio?.nombre}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo Institución:</span>
                    <p className="font-medium">{miInstitucion.tipoInstituciones?.descripcion}</p>
                  </div>
                  {!usuario?.nivelEducativo && (
                    <div>
                      <span className="text-muted-foreground">Tipo Bachiller:</span>
                      <p className="font-medium">{miInstitucion.tipoBachilleres?.descripcion}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Nivel Educativo:</span>
                    <p className="font-medium">{miInstitucion.nivelEducativo ? "Superior" : "Medio Superior"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Número de Carreras:</span>
                    <p className="font-medium">{miInstitucion.numeroCarreras}</p>
                  </div>
                  {miInstitucion && (
                    <CardFooter className="px-3">
                      <Link href={`/instituciones/${miInstitucion.id}/edit`} className="ml-auto">
                        <Button size="sm">
                          <PlusIcon className="mr-2 h-4 w-4" /> Editar
                        </Button>
                      </Link>
                    </CardFooter>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          {/* {miInstitucion && (
            <CardFooter className="px-3 p-2 ">
              <Link href={`/instituciones/${miInstitucion.id}/edit`} className="ml-auto">
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" /> Editar
                </Button>
              </Link>
            </CardFooter>
          )} */}
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-1 px-3 pt-3">
            <CardTitle>Datos Generales</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2">
            {datosGenerales.length === 0 ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">No hay datos generales</p>
                <Link href={{
                  pathname: "/datos-institucionales/new",
                  query: { idInstitucion: miInstitucion?.id }
                }}>
                  <Button size="sm">
                    <PlusIcon className="mr-2 h-4 w-4" /> Rellenar Datos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">                {datosGenerales.map((dato, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <h3 className="font-medium text-sm text-center mb-1">
                    {dato?.categoriasGenerales?.descripcion || "Categoría"}
                  </h3>
                  <div className="flex justify-around items-center">
                    <div className="text-center px-2">
                      <UserIcon className="h-3 w-3 text-pink-500 mx-auto mb-0.5" />
                      <p className="text-xs text-muted-foreground">Mujeres</p>
                      <p className="font-semibold text-sm text-pink-600">{dato?.cantidadMujeres || "0"}</p>
                    </div>
                    <div className="text-center px-2">
                      <UsersIcon className="h-3 w-3 text-blue-500 mx-auto mb-0.5" />
                      <p className="text-xs text-muted-foreground">Hombres</p>
                      <p className="font-semibold text-sm text-blue-600">{dato?.cantidadHombres || "0"}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
          {datosGenerales.length > 0 && (
            <CardFooter className="px-3">
              <Link href={{
                pathname: "/datos-institucionales/edit",
                query: { idInstitucion: miInstitucion?.id }
              }} className="ml-auto">
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" /> Editar
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
        {/* <div className="md:col-span-1"></div> */}
      </div>



      <div className="mt-6">
        {miInstitucion && miInstitucion.nivelEducativo != false ? (
          <>
            {misCuestionarios.length > 0 && (
              <CuestionarioTable cuestionarioList={misCuestionarios} />
            )}
            {misCuestionarios.length < (miInstitucion.numeroCarreras || 0) && (
              <div className="mt-4 max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-3 text-center">
                  {misCuestionarios.length === 0
                    ? "Rellena los datos de las carreras"
                    : "Carreras faltantes"}
                </h3>
                <div className="space-y-2">
                  {Array.from({ length: (miInstitucion.numeroCarreras || 0) - misCuestionarios.length }).map((_, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: "/carrera-instituciones/new",
                        query: { idInstitucion: miInstitucion.id }
                      }}
                      className="block"
                    >
                      <Button className="w-full justify-start" variant="outline" size="sm">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Carrera {misCuestionarios.length + index + 1}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : miInstitucion && miInstitucion.nivelEducativo == false ? (
          <CuestionarioTable cuestionarioList={misCuestionarios} />
        ) : (<p className="text-center text-muted-foreground">
          No tienes datos de la institución
        </p>)}
      </div>

      {/* {misCuestionarios.length > 0 && miInstitucion?.nivelEducativo != false && (
        <div className="mt-4">
          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
          />
        </div>
      )} */}


      <div className="flex justify-center">
        {
          miInstitucion?.nivelEducativo == false && miInstitucion.tipoBachilleres?.descripcion == "Tecnologico" ? <div>
            {/* {Array.from({ length: (miInstitucion.numeroCarreras || 0) - misEspecialidades.length }).map((_, index) => (
              <Link
                key={index}
                href={{
                  pathname: "/especialidades/new",
                  query: { idCuestionario: misCuestionarios[0].id }
                }}
                className="block"
              >
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Especialidad {misEspecialidades.length + index + 1}
                  {JSON.stringify(misEspecialidades)}
                </Button>
              </Link>
            ))} */}

            {
              misEspecialidades.map((especialidad, index) => (
                <EspecialidadUpdateForm key={index} especialidad={especialidad} />
              ))
            }
            {

              Array.from({ length: (miInstitucion.numeroCarreras || 0) - misEspecialidades.length }).map((_, index) => (
                <EspecialidadCreateForm key={index} cuestionarioId={misCuestionarios[0].id} />
              ))


            }

          </div> :
            (
              <div></div>
            )

        }
      </div>

    </div >
  );
}
