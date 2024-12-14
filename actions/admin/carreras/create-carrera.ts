"use server";

import { db } from "@/lib/db";
import { carreras } from "@/schema/carreras";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertCarreraSchema = createInsertSchema(carreras);

export interface CreateCarreraState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
    clave?: string[];
  };
}

export async function createCarrera(
  prevState: CreateCarreraState,
  formData: FormData
): Promise<CreateCarreraState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = insertCarreraSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
      clave: formData.get("clave") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(carreras).values(validatedFields.data);

    revalidatePath("/admin/carreras");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/carreras");
}
