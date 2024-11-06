"use server";

import { db } from "@/lib/db";
import { preguntas } from "@/schema/preguntas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertPreguntaSchema = createInsertSchema(preguntas);

export interface CreatePreguntaState extends BaseActionState {
  errors?: {
    id?: string[];
    categoriaPersonasId?: string[];
    cuestionariosId?: string[];
    cantidadMujeres?: string[];
    cantidadHombres?: string[];
  };
}

export async function createPregunta(
  prevState: CreatePreguntaState,
  formData: FormData
): Promise<CreatePreguntaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = insertPreguntaSchema.safeParse({
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

    await db.insert(preguntas).values(validatedFields.data);
    
    revalidatePath("/preguntas");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/preguntas");
}
