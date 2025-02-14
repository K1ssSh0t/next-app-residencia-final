"use server";

import { db } from "@/lib/db";
import { Institucion, instituciones } from "@/schema/instituciones";
import { and, eq, ilike, like, SQL, SQLWrapper } from "drizzle-orm";
import { InstitucionesWithRelations } from "@/repositories/institucione-repository";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { cuestionarios } from "@/schema/cuestionarios";
import { carreras } from "@/schema/carreras";
import { auth } from "@/lib/auth";
import { isUser } from "@/services/authorization-service";

interface SearchParams {
  region?: string;
  institutionType?: string;
  municipalityType?: string; // Nuevo parámetro
  institutionName?: string;
  year?: string; // Nuevo parámetro
  careerType?: string;
}

export type InstitucionesBusqueda = Awaited<ReturnType<typeof buscarSuperior>>;

export async function buscarSuperior(params: SearchParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (isUser(session)) {
      throw new Error("unauthorized");
    }

    let whereClause: SQL[] = [eq(instituciones.nivelEducativo, true)];

    if (params.region) {
      whereClause.push(like(instituciones.regionId, params.region));
    }

    if (params.institutionType) {
      whereClause.push(
        like(instituciones.tipoInstitucionesId, params.institutionType),
      );
    }

    if (params.municipalityType) {
      whereClause.push(
        like(instituciones.municipioId, params.municipalityType),
      );
    }

    if (params.institutionName) {
      whereClause.push(
        ilike(instituciones.nombre, `%${params.institutionName}%`),
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
        let datosInstConditions = [
          eq(datosInstitucionales.institucionesId, institution.id),
        ];
        if (params.year) {
          datosInstConditions.push(
            eq(datosInstitucionales.anio, parseInt(params.year)),
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

        let cuestionario = await db.query.cuestionarios.findMany({
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

        // Filtrar por tipo de carrera
        if (params.careerType) {
          cuestionario = cuestionario.filter((c) => {
            const clave = c.carrera?.carrera?.clave || "";
            switch (params.careerType) {
              case "carrera":
                return clave.startsWith("4") || clave.startsWith("5");
              case "especialidad":
                return clave.startsWith("6");
              case "maestria":
                return clave.startsWith("7");
              case "doctorado":
                return clave.startsWith("8");
              default:
                return true;
            }
          });
        }

        // Return null if no data is found for the selected year
        if (
          params.year &&
          datosInst.length === 0 &&
          cuestionario.length === 0
        ) {
          return null;
        }

        return {
          ...institution,
          datosInstitucionales: datosInst,
          cuestionario,
        };
      }),
    );

    const filteredInstitutions = institutionsWithData.filter(
      (institution): institution is NonNullable<typeof institution> =>
        institution !== null,
    );

    return filteredInstitutions;
  } catch (error) {
    console.error("Error searching institutions:", error);
    throw new Error("Error al buscar instituciones");
  }
}
