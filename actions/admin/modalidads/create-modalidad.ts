"use server";

import { db } from "@/lib/db";
import { modalidades } from "@/schema/modalidads";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const insertModalidadSchema = createInsertSchema(modalidades);

export interface CreateModalidadState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function createModalidad(
  prevState: CreateModalidadState,
  formData: FormData
): Promise<CreateModalidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = insertModalidadSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(modalidades).values(validatedFields.data);

    revalidatePath("/admin/modalidades");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/modalidades");
}
