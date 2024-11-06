"use server";

import { db } from "@/lib/db";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateTipoInstitucioneSchema = createSelectSchema(tipoInstituciones).partial().required({ id: true });

export interface UpdateTipoInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function updateTipoInstitucione(
  prevState: UpdateTipoInstitucioneState,
  formData: FormData
): Promise<UpdateTipoInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = updateTipoInstitucioneSchema.safeParse({
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
      .update(tipoInstituciones)
      .set(validatedFields.data)
      .where(eq(tipoInstituciones.id, validatedFields.data.id));

    revalidatePath("/admin/tipo-instituciones");
    revalidatePath("/admin/tipo-instituciones/" + validatedFields.data.id);
    revalidatePath("/admin/tipo-instituciones/" + validatedFields.data.id + "/edit");

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
