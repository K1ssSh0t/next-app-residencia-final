"use server";

import { db } from "@/lib/db";
import { categoriasGenerales } from "@/schema/categorias-generales";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const insertCategoriasGeneraleSchema = createInsertSchema(categoriasGenerales);

export interface CreateCategoriasGeneraleState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function createCategoriasGenerale(
  prevState: CreateCategoriasGeneraleState,
  formData: FormData
): Promise<CreateCategoriasGeneraleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = insertCategoriasGeneraleSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(categoriasGenerales).values(validatedFields.data);
    
    revalidatePath("/admin/categorias-generales");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/categorias-generales");
}
