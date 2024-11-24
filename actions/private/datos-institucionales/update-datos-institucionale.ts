"use server";

import { db } from "@/lib/db";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateDatosInstitucionaleSchema = createSelectSchema(datosInstitucionales).partial().required({ id: true });

export interface UpdateDatosInstitucionaleState extends BaseActionState {
  errors?: {
    id?: string[];
    institucionesId?: string[];
    categoriasGeneralesId?: string[];
    cantidadHombres?: string[];
    cantidadMujeres?: string[];
  };
}

export async function updateDatosInstitucionale(
  prevState: UpdateDatosInstitucionaleState,
  formData: FormData
): Promise<UpdateDatosInstitucionaleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = updateDatosInstitucionaleSchema.safeParse({
      id: formData.get("id") as string,
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

    await db
      .update(datosInstitucionales)
      .set(validatedFields.data)
      .where(eq(datosInstitucionales.id, validatedFields.data.id));

    revalidatePath("/datos-institucionales");
    revalidatePath("/datos-institucionales/" + validatedFields.data.id);
    revalidatePath("/datos-institucionales/" + validatedFields.data.id + "/edit");

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
