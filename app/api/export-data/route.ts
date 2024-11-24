import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/schema/users";
import { instituciones } from "@/schema/instituciones";
import { cuestionarios } from "@/schema/cuestionarios";
import { preguntas } from "@/schema/preguntas";
import { carreras } from "@/schema/carreras";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { tipoBachilleres } from "@/schema/tipo-bachilleres";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        usuario: users.name,
        institucion: instituciones.nombre,
        region: instituciones.regionId,
        municipio: instituciones.municipioId,
        tipoInstitucion: tipoInstituciones.descripcion,
        tipoBachiller: tipoBachilleres.descripcion,
        nivelEducativo: instituciones.nivelEducativo,
        añoCuestionario: cuestionarios.año,
        carrera: carreras.descripcion,
        preguntasData: sql<string>`json_agg(json_build_object(
          'categoriaPersona', ${categoriaPersonas.descripcion},
          'cantidadMujeres', ${preguntas.cantidadMujeres},
          'cantidadHombres', ${preguntas.cantidadHombres}
        ))`,
      })
      .from(users)
      .leftJoin(instituciones, eq(users.id, instituciones.usersId))
      .leftJoin(cuestionarios, eq(users.id, cuestionarios.usersId))
      .leftJoin(carreras, eq(cuestionarios.carrerasId, carreras.id))
      .leftJoin(
        tipoInstituciones,
        eq(instituciones.tipoInstitucionesId, tipoInstituciones.id)
      )
      .leftJoin(
        tipoBachilleres,
        eq(instituciones.tipoBachilleresId, tipoBachilleres.id)
      )
      .leftJoin(preguntas, eq(cuestionarios.id, preguntas.cuestionariosId))
      .leftJoin(
        categoriaPersonas,
        eq(preguntas.categoriaPersonasId, categoriaPersonas.id)
      )
      .groupBy(
        users.id,
        instituciones.id,
        tipoInstituciones.id,
        tipoBachilleres.id,
        cuestionarios.id,
        carreras.id
      );
    //console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
