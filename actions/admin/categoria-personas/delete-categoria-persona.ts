"use server";

import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteCategoriaPersonaSchema = createSelectSchema(categoriaPersonas).pick({ id: true });

export interface DeleteCategoriaPersonaState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteCategoriaPersona(
  prevState: DeleteCategoriaPersonaState,
  formData: FormData
): Promise<DeleteCategoriaPersonaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteCategoriaPersonaSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(categoriaPersonas).where(eq(categoriaPersonas.id, validatedFields.data.id));
    
    revalidatePath("/admin/categoria-personas");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/categoria-personas");
}
