"use server";

import { db } from "@/lib/db";
import { tipoInstituciones } from "@/schema/tipo-instituciones";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertTipoInstitucioneSchema = createInsertSchema(tipoInstituciones);

export interface CreateTipoInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
    descripcion?: string[];
  };
}

export async function createTipoInstitucione(
  prevState: CreateTipoInstitucioneState,
  formData: FormData
): Promise<CreateTipoInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = insertTipoInstitucioneSchema.safeParse({
      descripcion: formData.get("descripcion") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(tipoInstituciones).values(validatedFields.data);
    
    revalidatePath("/admin/tipo-instituciones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/tipo-instituciones");
}
