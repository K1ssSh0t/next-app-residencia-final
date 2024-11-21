"use server";

import { db } from "@/lib/db";
import { carreraInstituciones } from "@/schema/carrera-institucions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteCarreraInstitucionSchema = createSelectSchema(
  carreraInstituciones
).pick({ id: true });

export interface DeleteCarreraInstitucionState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteCarreraInstitucion(
  prevState: DeleteCarreraInstitucionState,
  formData: FormData
): Promise<DeleteCarreraInstitucionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    const validatedFields = deleteCarreraInstitucionSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .delete(carreraInstituciones)
      .where(eq(carreraInstituciones.id, validatedFields.data.id));

    revalidatePath("/carrera-instituciones");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    };
  }

  redirect("/carrera-instituciones");
}
