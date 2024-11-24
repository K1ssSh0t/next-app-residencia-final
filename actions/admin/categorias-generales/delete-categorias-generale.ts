"use server";

import { db } from "@/lib/db";
import { categoriasGenerales } from "@/schema/categorias-generales";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteCategoriasGeneraleSchema = createSelectSchema(categoriasGenerales).pick({ id: true });

export interface DeleteCategoriasGeneraleState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteCategoriasGenerale(
  prevState: DeleteCategoriasGeneraleState,
  formData: FormData
): Promise<DeleteCategoriasGeneraleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteCategoriasGeneraleSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(categoriasGenerales).where(eq(categoriasGenerales.id, validatedFields.data.id));
    
    revalidatePath("/admin/categorias-generales");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/categorias-generales");
}
