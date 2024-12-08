"use server";

import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { eq } from "drizzle-orm";
import { carreras } from "@/schema/carreras";
import { cuestionarios } from "@/schema/cuestionarios";

const insertInstitucioneSchema = createInsertSchema(instituciones).extend({
  nivelEducativo: z.boolean(),
});

export interface CreateInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    region?: string[];
    municipio?: string[];
    tipoInstitucionesId?: string[];
    tipoBachilleresId?: string[];
    //usersId?: string[];
    nivelEducativo?: string[];
    claveInstitucion?: string[];
    claveCentroTrabajo?: string[];
    numeroCarreras?: string[];
  };
}

export async function createInstitucione(
  prevState: CreateInstitucioneState,
  formData: FormData
): Promise<CreateInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = insertInstitucioneSchema.safeParse({
      nombre: formData.get("nombre") as string,
      regionId: formData.get("region") as string,
      municipioId: formData.get("municipio") as string,
      tipoInstitucionesId: formData.get("tipoInstitucionesId") as string,
      tipoBachilleresId: formData.get("tipoBachilleresId") as string,
      usersId: session?.user?.id as string,
      nivelEducativo: formData.get("nivelEducativo") === "true",
      claveInstitucion: formData.get("claveInstitucion") as string,
      claveCentroTrabajo: formData.get("claveCentroTrabajo") as string,
      numeroCarreras: parseInt(formData.get("numeroCarreras") as string),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    const insertInstitucion = await db
      .insert(instituciones)
      .values(validatedFields.data)
      .returning({ id: instituciones.id, nivel: instituciones.nivelEducativo });

    if (insertInstitucion.pop()?.nivel != true) {
      const carreraNoAplica = await db.query.carreras.findFirst({
        where: eq(carreras.descripcion, "No aplica"),
      });

      const insertCarreraInstitucion = await db
        .insert(carreraInstituciones)
        .values({
          carrerasId: carreraNoAplica?.id,
          institucionesId: insertInstitucion.pop()?.id,
        })
        .returning({ id: carreraInstituciones.id });

      await db.insert(cuestionarios).values({
        carrerasId: insertCarreraInstitucion.pop()?.id,
        usersId: session.user.id,
      });
    }

    revalidatePath("/instituciones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/instituciones");
}
