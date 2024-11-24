import { notFound } from "next/navigation";
import { getInstitucioneWithRelations } from "@/repositories/institucione-repository";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
            <div className="grid grid-cols-10 gap-4 ">
                <Card className="w-full col-span-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Institución</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!institucion ? (
                            <div className="text-center text-muted-foreground">No tienes datos</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <h2 className="text-xl font-semibold mb-2">{institucion.nombre?.toString()}</h2>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Clave Institución</p>

                                    <h2 className="text-xl font-semibold mb-2">{institucion.claveInstitucion?.toString()}</h2>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Clave Centro Trabajo</p>

                                    <h2 className="text-xl font-semibold mb-2">{institucion.claveCentroTrabajo?.toString()}</h2>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Región</p>
                                    <p>{institucion.region?.nombre?.toString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Municipio</p>
                                    <p>{institucion.municipio?.nombre?.toString()}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tipo Institución</p>
                                    <p>{institucion.tipoInstituciones?.descripcion?.toString()}</p>
                                </div>
                                {!institucion.nivelEducativo && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Tipo Bachiller</p>
                                        <p>{institucion.tipoBachilleres?.descripcion?.toString()}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nivel Educativo</p>
                                    <p>{institucion.nivelEducativo ? "Superior" : "Medio Superior"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Numero de Carreras</p>
                                    <p>{institucion.numeroCarreras?.toString()}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    {institucion && (
                        <CardFooter className="flex justify-end">
                            <Link href={`/instituciones/${institucion.id}/edit`}>
                                <Button>
                                    <PlusIcon className="mr-2 h-4 w-4" /> Editar Datos de la Institución
                                </Button>
                            </Link>
                        </CardFooter>
                    )}
                </Card>
                <Card className="w-full col-span-4">
                    <CardHeader>
                        <CardTitle className="text-3xl">Datos Generales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">

                            {datosGenerales.map((dato, index) => (
                                <div key={index}>

                                    <h2 className="text-xl font-semibold mb-2">{dato?.categoriasGenerale?.descripcion?.toString()}</h2>
                                    <p>Cantidad Mujeres: {dato?.cantidadMujeres?.toString()}</p>
                                    <p>Cantidad Hombres: {dato?.cantidadHombres?.toString()}</p>


                                </div>
                            ))
                            }
                        </div>
                    </CardContent>

                </Card>
            </div>
            <div className="text-center font-bold text-xl flex justify-center m-4 ">Cuestionarios</div>
            <div>
                {cuestionario ? <CuestionarioTable cuestionarioList={cuestionario} /> : <div>No tiene datos de cuestionario</div>}
            </div>
        </div>
    );
}
