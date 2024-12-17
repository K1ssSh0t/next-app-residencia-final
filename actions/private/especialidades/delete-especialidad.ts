"use server";

import { db } from "@/lib/db";
import { especialidades } from "@/schema/especialidades";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteEspecialidadSchema = createSelectSchema(especialidades).pick({
  id: true,
});

export interface DeleteEspecialidadState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteEspecialidad(
  prevState: DeleteEspecialidadState,
  formData: FormData
): Promise<DeleteEspecialidadState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = deleteEspecialidadSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .delete(especialidades)
      .where(eq(especialidades.id, validatedFields.data.id));

    revalidatePath("/especialidades");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    };
  }

  redirect("/especialidades");
}
