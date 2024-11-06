"use server";

import { db } from "@/lib/db";
import { preguntas } from "@/schema/preguntas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deletePreguntaSchema = createSelectSchema(preguntas).pick({ id: true });

export interface DeletePreguntaState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deletePregunta(
  prevState: DeletePreguntaState,
  formData: FormData
): Promise<DeletePreguntaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }


    const validatedFields = deletePreguntaSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(preguntas).where(eq(preguntas.id, validatedFields.data.id));
    
    revalidatePath("/preguntas");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/preguntas");
}
