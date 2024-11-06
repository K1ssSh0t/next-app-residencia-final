"use server";

import { db } from "@/lib/db";
import { categoriaPersonas } from "@/schema/categoria-personas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertCategoriaPersonaSchema = createInsertSchema(categoriaPersonas);

export interface CreateCategoriaPersonaState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function createCategoriaPersona(
  prevState: CreateCategoriaPersonaState,
  formData: FormData
): Promise<CreateCategoriaPersonaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = insertCategoriaPersonaSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(categoriaPersonas).values(validatedFields.data);
    
    revalidatePath("/admin/categoria-personas");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/categoria-personas");
}
