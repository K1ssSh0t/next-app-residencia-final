"use server";

import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertInstitucioneSchema = createInsertSchema(instituciones);

export interface CreateInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    region?: string[];
    municipio?: string[];
    tipoInstitucionesId?: string[];
    tipoBachilleresId?: string[];
    usersId?: string[];
    nivelEducativo?: string[];
  };
}

export async function createInstitucione(
  prevState: CreateInstitucioneState,
  formData: FormData
): Promise<CreateInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = insertInstitucioneSchema.safeParse({
      nombre: formData.get("nombre") as string,
      region: formData.get("region") as string,
      municipio: formData.get("municipio") as string,
      tipoInstitucionesId: formData.get("tipoInstitucionesId") as string,
      tipoBachilleresId: formData.get("tipoBachilleresId") as string,
      usersId: formData.get("usersId") as string,
      nivelEducativo: !!formData.get("nivelEducativo"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(instituciones).values(validatedFields.data);
    
    revalidatePath("/instituciones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/instituciones");
}
