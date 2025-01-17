"use server";

import { db } from "@/lib/db";
import { especialidadesListas } from "@/schema/especialidades-listas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteEspecialidadesListaSchema = createSelectSchema(especialidadesListas).pick({ id: true });

export interface DeleteEspecialidadesListaState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteEspecialidadesLista(
  prevState: DeleteEspecialidadesListaState,
  formData: FormData
): Promise<DeleteEspecialidadesListaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteEspecialidadesListaSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(especialidadesListas).where(eq(especialidadesListas.id, validatedFields.data.id));
    
    revalidatePath("/admin/especialidades-listas");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/especialidades-listas");
}
