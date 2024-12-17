"use server";

import { db } from "@/lib/db";
import { carreras } from "@/schema/carreras";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateCarreraSchema = createSelectSchema(carreras)
  .partial()
  .required({ id: true });

export interface UpdateCarreraState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
    clave?: string[];
  };
}

export async function updateCarrera(
  prevState: UpdateCarreraState,
  formData: FormData
): Promise<UpdateCarreraState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = updateCarreraSchema.safeParse({
      id: formData.get("id") as string,
      descripcion: formData.get("descripcion") as string,
      clave: formData.get("clave") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(carreras)
      .set(validatedFields.data)
      .where(eq(carreras.id, validatedFields.data.id));

    revalidatePath("/admin/carreras");
    revalidatePath("/admin/carreras/" + validatedFields.data.id);
    revalidatePath("/admin/carreras/" + validatedFields.data.id + "/edit");

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }
}
