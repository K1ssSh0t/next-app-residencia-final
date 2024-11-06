"use server";

import { db } from "@/lib/db";
import { instituciones } from "@/schema/instituciones";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const deleteInstitucioneSchema = createSelectSchema(instituciones).pick({ id: true });

export interface DeleteInstitucioneState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteInstitucione(
  prevState: DeleteInstitucioneState,
  formData: FormData
): Promise<DeleteInstitucioneState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }


    const validatedFields = deleteInstitucioneSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(instituciones).where(eq(instituciones.id, validatedFields.data.id));
    
    revalidatePath("/instituciones");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/instituciones");
}
