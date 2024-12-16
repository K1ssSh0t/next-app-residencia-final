import { db } from "@/lib/db";
import { like } from "drizzle-orm";
import { instituciones } from "@/schema/instituciones";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { users } from "@/schema/users";
import { regiones } from "@/schema/regions";
import { municipios } from "@/schema/municipios";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { carreras } from "@/schema/carreras";
import { modalidades } from "@/schema/modalidads";
import { cuestionarios } from "@/schema/cuestionarios";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { categoriasGenerales } from "@/schema/categorias-generales";
import { especialidades } from "@/schema/especialidades";
import { preguntas } from "@/schema/preguntas";
import { categoriaPersonas } from "@/schema/categoria-personas";

export type InstitucionWithRelations = Awaited<
  ReturnType<typeof getInstitutionWithRelations>
>;

export async function getInstitutionWithRelations(institutionName: string) {
  const result = await db.query.instituciones.findFirst({
    where: like(instituciones.nombre, `%${institutionName}%`),
    with: {
      tipoInstituciones: true,
      tipoBachilleres: true,
      user: true,
      region: true,
      municipio: true,
    },
  });

  return result;
}
