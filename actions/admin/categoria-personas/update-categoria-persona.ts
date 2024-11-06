"use server";

import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateCategoriaPersonaSchema = createSelectSchema(categoriaPersonas).partial().required({ id: true });

export interface UpdateCategoriaPersonaState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function updateCategoriaPersona(
  prevState: UpdateCategoriaPersonaState,
  formData: FormData
): Promise<UpdateCategoriaPersonaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = updateCategoriaPersonaSchema.safeParse({
      id: formData.get("id") as string,
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(categoriaPersonas)
      .set(validatedFields.data)
      .where(eq(categoriaPersonas.id, validatedFields.data.id));

    revalidatePath("/admin/categoria-personas");
    revalidatePath("/admin/categoria-personas/" + validatedFields.data.id);
    revalidatePath("/admin/categoria-personas/" + validatedFields.data.id + "/edit");

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
