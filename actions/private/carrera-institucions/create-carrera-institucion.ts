"use server";

import { db } from "@/lib/db";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { cuestionarios } from "@/schema/cuestionarios";

const insertCarreraInstitucionSchema = createInsertSchema(carreraInstituciones);

export interface CreateCarreraInstitucionState extends BaseActionState {
  errors?: {
    id?: string[];
    institucionesId?: string[];
    carrerasId?: string[];
    nombreRevoe?: string[];
    planDeEstudio?: string[];
    modalidadesId?: string[];
    numeroRevoe?: string[];
  };
}

export async function createCarreraInstitucion(
  prevState: CreateCarreraInstitucionState,
  formData: FormData
): Promise<CreateCarreraInstitucionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = insertCarreraInstitucionSchema.safeParse({
      institucionesId: formData.get("institucionesId") as string,
      carrerasId: formData.get("carrerasId") as string,
      nombreRevoe: formData.get("nombreRevoe") as string,
      planDeEstudio: formData.get("planDeEstudio") as string,
      modalidadesId: formData.get("modalidadesId") as string,
      numeroRevoe: formData.get("numeroRevoe") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    const insertCarreraInstitucion = await db
      .insert(carreraInstituciones)
      .values(validatedFields.data)
      .returning({ id: carreraInstituciones.id });

    await db
      .insert(cuestionarios)
      .values({
        carrerasId: insertCarreraInstitucion.pop()?.id,
        usersId: session.user.id,
      });

    revalidatePath("/carrera-instituciones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/carrera-instituciones");
}
