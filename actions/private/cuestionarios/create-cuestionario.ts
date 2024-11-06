"use server";

import { db } from "@/lib/db";
import { cuestionarios } from "@/schema/cuestionarios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertCuestionarioSchema = createInsertSchema(cuestionarios);

export interface CreateCuestionarioState extends BaseActionState {
  errors?: {
    id?: string[];
    año?: string[];
    carrerasId?: string[];
    usersId?: string[];
  };
}

export async function createCuestionario(
  prevState: CreateCuestionarioState,
  formData: FormData
): Promise<CreateCuestionarioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = insertCuestionarioSchema.safeParse({
      año: parseInt(formData.get("año") as string),
      carrerasId: formData.get("carrerasId") as string,
      usersId: formData.get("usersId") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(cuestionarios).values(validatedFields.data);
    
    revalidatePath("/cuestionarios");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/cuestionarios");
}
