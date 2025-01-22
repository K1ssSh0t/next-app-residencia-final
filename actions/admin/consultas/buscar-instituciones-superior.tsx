"use server";

import { db } from "@/lib/db";
import { Institucion, instituciones } from "@/schema/instituciones";
import { and, eq, ilike, like, SQL, SQLWrapper } from "drizzle-orm";
import { InstitucionesWithRelations } from "@/repositories/institucione-repository";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { cuestionarios } from "@/schema/cuestionarios";

interface SearchParams {
    region?: string;
    institutionType?: string;
    municipalityType?: string; // Nuevo parámetro
    institutionName?: string;
    year?: string; // Nuevo parámetro
}

export type InstitucionesBusqueda = Awaited<
    ReturnType<typeof buscarSuperior>
>;

export async function buscarSuperior(params: SearchParams) {
    try {
        let whereClause: SQL[] = [eq(instituciones.nivelEducativo, true)];

        if (params.region) {
            whereClause.push(like(instituciones.regionId, params.region));
        }

        if (params.institutionType) {
            whereClause.push(
                like(instituciones.tipoInstitucionesId, params.institutionType)
            );
        }

        if (params.municipalityType) {
            whereClause.push(
                like(instituciones.municipioId, params.municipalityType)
            );
        }

        if (params.institutionName) {
            whereClause.push(
                ilike(instituciones.nombre, `%${params.institutionName}%`)
            );
        }

        const institutionsData = await db.query.instituciones.findMany({
            where: and(...whereClause),
            with: {
                region: true,
                tipoInstituciones: true,
                tipoBachilleres: true,
                municipio: true,
                user: true,
            },
        });

        // Fetch datos institucionales separately
        const institutionsWithData = await Promise.all(
            institutionsData.map(async (institution) => {
                const datosInst = await db.query.datosInstitucionales.findMany({
                    where: eq(datosInstitucionales.institucionesId, institution.id),
                    with: {
                        categoriasGenerales: true,
                    },
                });

                let whereConditions = [eq(cuestionarios.usersId, institution.usersId!)];
                if (params.year) {
                    whereConditions.push(eq(cuestionarios.año, parseInt(params.year)));
                }

                const cuestionario = await db.query.cuestionarios.findMany({
                    where: and(...whereConditions),
                    with: {
                        carrera: {
                            with: {
                                modalidad: true,
                                carrera: true,
                            },
                        },
                        preguntas: {
                            with: {
                                categoriaPersona: true,
                            },
                        },
                    },
                });

                return {
                    ...institution,
                    datosInstitucionales: datosInst,
                    cuestionario
                };
            })
        );
        return institutionsWithData;
    } catch (error) {
        console.error("Error searching institutions:", error);
        throw new Error("Error al buscar instituciones");
    }
}
