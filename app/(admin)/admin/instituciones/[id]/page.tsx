import { notFound } from "next/navigation";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, UserIcon, UsersIcon } from "lucide-react";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { instituciones } from "@/schema/instituciones";
import { cuestionarios } from "@/schema/cuestionarios";
import { CuestionarioTable } from "@/components/private/cuestionarios/cuestionario-admin-table";
import { datosInstitucionales } from "@/schema/datos-institucionales";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    // const institucion = await getInstitucioneWithRelations(id);
    const institucion = await db.query.instituciones.findFirst({
        where: eq(instituciones.id, id),
        with: {
            tipoBachilleres: true,
            tipoInstituciones: true,

            municipio: true,
            region: true,

        },
    });

    if (!institucion) {
        notFound();
    }


    const cuestionario = await db.query.cuestionarios.findMany({
        with: {
            carrera: {
                with: {
                    modalidade: true,
                    carrera: true,
                }
            }
        },

        where: eq(cuestionarios.usersId, `${institucion.usersId}`),
    });

    const datosGenerales = await db.query.datosInstitucionales.findMany({
        with: {
            categoriasGenerale: true,
        },
        where: eq(datosInstitucionales.institucionesId, `${id}`),
    })


    return (
        <div>
            <h1 className="text-xl font-bold mb-6">Instituciones</h1>
            <div className="grid gap-3 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader className="pb-1 px-3 pt-3">
                        <CardTitle></CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 py-2">
                        {!institucion ? (
                            <div className="text-center text-muted-foreground">No tienes datos</div>
                        ) : (
                            <div className="grid gap-2 text-sm">
                                <div className="border-b pb-1">
                                    <h2 className="font-semibold text-base">{institucion.nombre}</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1.5">                                     <div>
                                    <span className="text-muted-foreground">Clave Institución:</span>
                                    <p className="font-medium">{institucion.claveInstitucion}</p>
                                </div>
                                    <div>
                                        <span className="text-muted-foreground">Clave Centro Trabajo:</span>
                                        <p className="font-medium">{institucion.claveCentroTrabajo}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Región:</span>
                                        <p className="font-medium">{institucion.region?.nombre}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Municipio:</span>
                                        <p className="font-medium">{institucion.municipio?.nombre}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Tipo Institución:</span>
                                        <p className="font-medium">{institucion.tipoInstituciones?.descripcion}</p>
                                    </div>
                                    {!institucion?.nivelEducativo && (
                                        <div>
                                            <span className="text-muted-foreground">Tipo Bachiller:</span>
                                            <p className="font-medium">{institucion.tipoBachilleres?.descripcion}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground">Nivel Educativo:</span>
                                        <p className="font-medium">{institucion.nivelEducativo ? "Superior" : "Medio Superior"}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Número de Carreras:</span>
                                        <p className="font-medium">{institucion.numeroCarreras}</p>
                                    </div>
                                    {institucion && (
                                        <CardFooter className="px-3 py-2">
                                            <Link href={`/admin/instituciones/${institucion.id}/edit`} className="ml-auto">
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
                    {/* {institucion && (
                        <CardFooter className="px-3 py-2">
                            <Link href={`/admin/instituciones/${institucion.id}/edit`} className="ml-auto">
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
                                    pathname: "/admin/datos-institucionales/new",
                                    query: { idInstitucion: institucion?.id }
                                }}>
                                    <Button size="sm">
                                        <PlusIcon className="mr-2 h-4 w-4" /> Rellenar Datos
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">                                {datosGenerales.map((dato, index) => (
                                <div key={index} className="border rounded-lg p-2">
                                    <h3 className="font-medium text-sm text-center mb-1">
                                        {dato?.categoriasGenerale?.descripcion || "Categoría"}
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
                        <CardFooter className="px-3 py-2">
                            <Link href={{
                                pathname: "/admin/datos-institucionales/edit",
                                query: { idInstitucion: institucion?.id }
                            }} className="ml-auto">
                                <Button size="sm">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Editar
                                </Button>
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            </div>
            <div className="text-center font-bold text-xl flex justify-center m-4 ">Cuestionarios</div>
            <div>
                {cuestionario ? <CuestionarioTable cuestionarioList={cuestionario} /> : <div>No tiene datos de cuestionario</div>}
            </div>
        </div>
    );
}
