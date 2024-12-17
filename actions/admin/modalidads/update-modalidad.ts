"use server";

import { db } from "@/lib/db";
import { modalidades } from "@/schema/modalidads";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateModalidadSchema = createSelectSchema(modalidades)
  .partial()
  .required({ id: true });

export interface UpdateModalidadState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function updateModalidad(
  prevState: UpdateModalidadState,
  formData: FormData
): Promise<UpdateModalidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = updateModalidadSchema.safeParse({
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
      .update(modalidades)
      .set(validatedFields.data)
      .where(eq(modalidades.id, validatedFields.data.id));

    revalidatePath("/admin/modalidades");
    revalidatePath("/admin/modalidades/" + validatedFields.data.id);
    revalidatePath("/admin/modalidades/" + validatedFields.data.id + "/edit");

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
