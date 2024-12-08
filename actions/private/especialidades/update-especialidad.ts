"use server";

import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateEspecialidadSchema = createSelectSchema(especialidades)
  .partial()
  .required({ id: true });

export interface UpdateEspecialidadState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    hombres?: string[];
    mujeres?: string[];
    cuestionarioId?: string[];
  };
}

export async function updateEspecialidad(
  prevState: UpdateEspecialidadState,
  formData: FormData
): Promise<UpdateEspecialidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = updateEspecialidadSchema.safeParse({
      id: formData.get("id") as string,
      nombre: formData.get("nombre") as string,
      hombres: parseInt(formData.get("hombres") as string),
      mujeres: parseInt(formData.get("mujeres") as string),
      cuestionarioId: formData.get("cuestionarioId") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(especialidades)
      .set(validatedFields.data)
      .where(eq(especialidades.id, validatedFields.data.id));

    revalidatePath("/instituciones");
    revalidatePath("/especialidades/" + validatedFields.data.id);
    revalidatePath("/especialidades/" + validatedFields.data.id + "/edit");

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
