"use server";

import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertEspecialidadSchema = createInsertSchema(especialidades);

export interface CreateEspecialidadState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    hombres?: string[];
    mujeres?: string[];
    cuestionarioId?: string[];
  };
}

export async function createEspecialidad(
  prevState: CreateEspecialidadState,
  formData: FormData
): Promise<CreateEspecialidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = insertEspecialidadSchema.safeParse({
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

    await db.insert(especialidades).values(validatedFields.data);

    revalidatePath("/instituciones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/instituciones");
}
