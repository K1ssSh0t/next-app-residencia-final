"use server";

import { db } from "@/lib/db";
import { municipios } from "@/schema/municipios";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteMunicipioSchema = createSelectSchema(municipios).pick({ id: true });

export interface DeleteMunicipioState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteMunicipio(
  prevState: DeleteMunicipioState,
  formData: FormData
): Promise<DeleteMunicipioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteMunicipioSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(municipios).where(eq(municipios.id, validatedFields.data.id));
    
    revalidatePath("/admin/municipios");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/municipios");
}
