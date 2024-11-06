"use server";

import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateInstitucioneSchema = createSelectSchema(instituciones).partial().required({ id: true });

export interface UpdateInstitucioneState extends BaseActionState {
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

export async function updateInstitucione(
  prevState: UpdateInstitucioneState,
  formData: FormData
): Promise<UpdateInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }



    const validatedFields = updateInstitucioneSchema.safeParse({
      id: formData.get("id") as string,
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

    await db
      .update(instituciones)
      .set(validatedFields.data)
      .where(eq(instituciones.id, validatedFields.data.id));

    revalidatePath("/instituciones");
    revalidatePath("/instituciones/" + validatedFields.data.id);
    revalidatePath("/instituciones/" + validatedFields.data.id + "/edit");

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