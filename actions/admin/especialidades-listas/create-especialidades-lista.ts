"use server";

import { db } from "@/lib/db";
import { especialidadesListas } from "@/schema/especialidades-listas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const insertEspecialidadesListaSchema = createInsertSchema(especialidadesListas);

export interface CreateEspecialidadesListaState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
    clave?: string[];
  };
}

export async function createEspecialidadesLista(
  prevState: CreateEspecialidadesListaState,
  formData: FormData
): Promise<CreateEspecialidadesListaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = insertEspecialidadesListaSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
      clave: formData.get("clave") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(especialidadesListas).values(validatedFields.data);
    
    revalidatePath("/admin/especialidades-listas");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/especialidades-listas");
}
