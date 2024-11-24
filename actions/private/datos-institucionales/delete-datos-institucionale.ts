"use server";

import { db } from "@/lib/db";
import { datosInstitucionales } from "@/schema/datos-institucionales";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteDatosInstitucionaleSchema = createSelectSchema(datosInstitucionales).pick({ id: true });

export interface DeleteDatosInstitucionaleState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteDatosInstitucionale(
  prevState: DeleteDatosInstitucionaleState,
  formData: FormData
): Promise<DeleteDatosInstitucionaleState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }


    const validatedFields = deleteDatosInstitucionaleSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(datosInstitucionales).where(eq(datosInstitucionales.id, validatedFields.data.id));
    
    revalidatePath("/datos-institucionales");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/datos-institucionales");
}
