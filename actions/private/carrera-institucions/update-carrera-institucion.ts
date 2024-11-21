"use server";

import { db } from "@/lib/db";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateCarreraInstitucionSchema = createSelectSchema(carreraInstituciones)
  .partial()
  .required({ id: true });

export interface UpdateCarreraInstitucionState extends BaseActionState {
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

export async function updateCarreraInstitucion(
  prevState: UpdateCarreraInstitucionState,
  formData: FormData
): Promise<UpdateCarreraInstitucionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = updateCarreraInstitucionSchema.safeParse({
      id: formData.get("id") as string,
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

    await db
      .update(carreraInstituciones)
      .set(validatedFields.data)
      .where(eq(carreraInstituciones.id, validatedFields.data.id));

    revalidatePath("/carrera-instituciones");
    revalidatePath("/carrera-instituciones/" + validatedFields.data.id);
    revalidatePath(
      "/carrera-instituciones/" + validatedFields.data.id + "/edit"
    );

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }
}
