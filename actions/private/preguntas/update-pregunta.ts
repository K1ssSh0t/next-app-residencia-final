"use server";

import { db } from "@/lib/db";
import { preguntas } from "@/schema/preguntas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updatePreguntaSchema = createSelectSchema(preguntas).partial().required({ id: true });

export interface UpdatePreguntaState extends BaseActionState {
  errors?: {
    id?: string[];
    categoriaPersonasId?: string[];
    cuestionariosId?: string[];
    cantidadMujeres?: string[];
    cantidadHombres?: string[];
  };
}

export async function updatePregunta(
  prevState: UpdatePreguntaState,
  formData: FormData
): Promise<UpdatePreguntaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = updatePreguntaSchema.safeParse({
      id: formData.get("id") as string,
      categoriaPersonasId: formData.get("categoriaPersonasId") as string,
      cuestionariosId: formData.get("cuestionariosId") as string,
      cantidadMujeres: parseInt(formData.get("cantidadMujeres") as string),
      cantidadHombres: parseInt(formData.get("cantidadHombres") as string),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(preguntas)
      .set(validatedFields.data)
      .where(eq(preguntas.id, validatedFields.data.id));

    revalidatePath("/preguntas");
    revalidatePath("/preguntas/" + validatedFields.data.id);
    revalidatePath("/preguntas/" + validatedFields.data.id + "/edit");

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }
}
