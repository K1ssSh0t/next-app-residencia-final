"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { carreras } from "@/schema/carreras";
import { eq } from "drizzle-orm";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { cuestionarios } from "@/schema/cuestionarios";

export async function createAutoCuestionario(institucionId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const carreraNoAplica = await db.query.carreras.findFirst({
      where: eq(carreras.descripcion, "No aplica"),
    });

    if (!carreraNoAplica?.id) {
      throw new Error("Carrera 'No aplica' not found");
    }

    const carreraInstitucion = await db
      .insert(carreraInstituciones)
      .values({
        carrerasId: carreraNoAplica.id,
        institucionesId: institucionId,
      })
      .returning({ id: carreraInstituciones.id });

    await db.insert(cuestionarios).values({
      carrerasId: carreraInstitucion[0].id,
      usersId: session.user.id,
      año: new Date().getFullYear(),
    });

    revalidatePath("/cuestionario-usuario");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create cuestionario" };
  }
}
