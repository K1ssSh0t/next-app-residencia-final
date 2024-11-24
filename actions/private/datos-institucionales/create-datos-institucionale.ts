"use server";

import { db } from "@/lib/db";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertDatosInstitucionaleSchema = createInsertSchema(datosInstitucionales);

export interface CreateDatosInstitucionaleState extends BaseActionState {
  errors?: {
    id?: string[];
    institucionesId?: string[];
    categoriasGeneralesId?: string[];
    cantidadHombres?: string[];
    cantidadMujeres?: string[];
  };
}

export async function createDatosInstitucionale(
  prevState: CreateDatosInstitucionaleState,
  formData: FormData
): Promise<CreateDatosInstitucionaleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = insertDatosInstitucionaleSchema.safeParse({
      institucionesId: formData.get("institucionesId") as string,
      categoriasGeneralesId: formData.get("categoriasGeneralesId") as string,
      cantidadHombres: parseInt(formData.get("cantidadHombres") as string),
      cantidadMujeres: parseInt(formData.get("cantidadMujeres") as string),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(datosInstitucionales).values(validatedFields.data);
    
    revalidatePath("/datos-institucionales");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/datos-institucionales");
}
