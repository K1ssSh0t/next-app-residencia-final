"use server";

import { db } from "@/lib/db";
import { Institucion, instituciones } from "@/schema/instituciones";
import { and, eq, ilike, like, SQL, SQLWrapper } from "drizzle-orm";
import { InstitucionesWithRelations } from "@/repositories/institucione-repository";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { cuestionarios } from "@/schema/cuestionarios";
import { auth } from "@/lib/auth";
import { isUser } from "@/services/authorization-service";

interface SearchParams {
  region?: string;
  institutionType?: string;
  municipalityType?: string; // Nuevo parámetro
  institutionName?: string;
  tipoBachillerato?: string; // Nuevo parámetro
  year?: string; // Nuevo parámetro
}

export type InstitucionesBusqueda = Awaited<
  ReturnType<typeof buscarMedioSuperior>
>;

export async function buscarMedioSuperior(params: SearchParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (isUser(session)) {
      throw new Error("unauthorized");
    }

    let whereClause: SQL[] = [eq(instituciones.nivelEducativo, false)];

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

    if (params.tipoBachillerato) {
      whereClause.push(
        like(instituciones.tipoBachilleresId, params.tipoBachillerato)
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
        modalidad: true,
      },
    });

    // Fetch datos institucionales and cuestionarios separately
    const institutionsWithData = await Promise.all(
      institutionsData.map(async (institution) => {
        let datosInstConditions = [
          eq(datosInstitucionales.institucionesId, institution.id),
        ];
        if (params.year) {
          datosInstConditions.push(
            eq(datosInstitucionales.anio, parseInt(params.year))
          );
        }

        const datosInst = await db.query.datosInstitucionales.findMany({
          where: and(...datosInstConditions),
          with: {
            categoriasGenerales: true,
          },
        });

        let whereConditions = [eq(cuestionarios.usersId, institution.usersId!)];
        if (params.year) {
          whereConditions.push(eq(cuestionarios.año, parseInt(params.year)));
        }

        const cuestionariosData = await db.query.cuestionarios.findFirst({
          where: and(...whereConditions),
          with: {
            preguntas: {
              with: {
                categoriaPersona: true,
              },
            },
            especialidades: {
              with: {
                especialidadLista: true,
              },
            },
          },
        });

        // Si hay filtro de año y no hay datos para ese año, retornar null
        if (params.year && !cuestionariosData) {
          return null;
        }

        return {
          ...institution,
          datosInstitucionales: datosInst,
          cuestionariosData,
        };
      })
    );

    // Filtrar las instituciones que son null (no tienen datos para el año seleccionado)
    const filteredInstitutions = institutionsWithData.filter(
      (institution): institution is NonNullable<typeof institution> =>
        institution !== null
    );

    return filteredInstitutions;
  } catch (error) {
    console.error("Error searching institutions:", error);
    throw new Error("Error al buscar instituciones");
  }
}
