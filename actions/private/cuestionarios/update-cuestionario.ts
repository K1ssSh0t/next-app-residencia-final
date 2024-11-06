"use server";

import { db } from "@/lib/db";
import { cuestionarios } from "@/schema/cuestionarios";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateCuestionarioSchema = createSelectSchema(cuestionarios).partial().required({ id: true });

export interface UpdateCuestionarioState extends BaseActionState {
  errors?: {
    id?: string[];
    año?: string[];
    carrerasId?: string[];
    usersId?: string[];
  };
}

export async function updateCuestionario(
  prevState: UpdateCuestionarioState,
  formData: FormData
): Promise<UpdateCuestionarioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = updateCuestionarioSchema.safeParse({
      id: formData.get("id") as string,
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

    await db
      .update(cuestionarios)
      .set(validatedFields.data)
      .where(eq(cuestionarios.id, validatedFields.data.id));

    revalidatePath("/cuestionarios");
    revalidatePath("/cuestionarios/" + validatedFields.data.id);
    revalidatePath("/cuestionarios/" + validatedFields.data.id + "/edit");

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
