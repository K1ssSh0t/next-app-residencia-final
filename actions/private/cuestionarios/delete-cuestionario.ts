"use server";

import { db } from "@/lib/db";
import { cuestionarios } from "@/schema/cuestionarios";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteCuestionarioSchema = createSelectSchema(cuestionarios).pick({ id: true });

export interface DeleteCuestionarioState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteCuestionario(
  prevState: DeleteCuestionarioState,
  formData: FormData
): Promise<DeleteCuestionarioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }


    const validatedFields = deleteCuestionarioSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(cuestionarios).where(eq(cuestionarios.id, validatedFields.data.id));
    
    revalidatePath("/cuestionarios");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/cuestionarios");
}
