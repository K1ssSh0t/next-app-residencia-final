"use server";

import { db } from "@/lib/db";
import { categoriasGenerales } from "@/schema/categorias-generales";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateCategoriasGeneraleSchema = createSelectSchema(categoriasGenerales).partial().required({ id: true });

export interface UpdateCategoriasGeneraleState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function updateCategoriasGenerale(
  prevState: UpdateCategoriasGeneraleState,
  formData: FormData
): Promise<UpdateCategoriasGeneraleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = updateCategoriasGeneraleSchema.safeParse({
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
      .update(categoriasGenerales)
      .set(validatedFields.data)
      .where(eq(categoriasGenerales.id, validatedFields.data.id));

    revalidatePath("/admin/categorias-generales");
    revalidatePath("/admin/categorias-generales/" + validatedFields.data.id);
    revalidatePath("/admin/categorias-generales/" + validatedFields.data.id + "/edit");

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
