"use server";

import { db } from "@/lib/db";
import { modalidades } from "@/schema/modalidads";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteModalidadSchema = createSelectSchema(modalidades).pick({
  id: true,
});

export interface DeleteModalidadState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteModalidad(
  prevState: DeleteModalidadState,
  formData: FormData
): Promise<DeleteModalidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteModalidadSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .delete(modalidades)
      .where(eq(modalidades.id, validatedFields.data.id));

    revalidatePath("/admin/modalidades");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/modalidades");
}
