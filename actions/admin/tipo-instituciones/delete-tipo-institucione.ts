"use server";

import { db } from "@/lib/db";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteTipoInstitucioneSchema = createSelectSchema(tipoInstituciones).pick({ id: true });

export interface DeleteTipoInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteTipoInstitucione(
  prevState: DeleteTipoInstitucioneState,
  formData: FormData
): Promise<DeleteTipoInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteTipoInstitucioneSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(tipoInstituciones).where(eq(tipoInstituciones.id, validatedFields.data.id));
    
    revalidatePath("/admin/tipo-instituciones");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/tipo-instituciones");
}
