"use server";

import { db } from "@/lib/db";
import { especialidadesListas } from "@/schema/especialidades-listas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin, isConsultor, isUser } from "@/services/authorization-service";

const updateEspecialidadesListaSchema = createSelectSchema(especialidadesListas)
  .partial()
  .required({ id: true });

export interface UpdateEspecialidadesListaState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
    clave?: string[];
  };
}

export async function updateEspecialidadesLista(
  prevState: UpdateEspecialidadesListaState,
  formData: FormData,
): Promise<UpdateEspecialidadesListaState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (isUser(session) || isConsultor(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = updateEspecialidadesListaSchema.safeParse({
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
      .update(especialidadesListas)
      .set(validatedFields.data)
      .where(eq(especialidadesListas.id, validatedFields.data.id));

    revalidatePath("/admin/especialidades-listas");
    revalidatePath("/admin/especialidades-listas/" + validatedFields.data.id);
    revalidatePath(
      "/admin/especialidades-listas/" + validatedFields.data.id + "/edit",
    );

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
