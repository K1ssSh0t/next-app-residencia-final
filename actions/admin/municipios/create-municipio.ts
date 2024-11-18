"use server";

import { db } from "@/lib/db";
import { municipios } from "@/schema/municipios";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const insertMunicipioSchema = createInsertSchema(municipios);

export interface CreateMunicipioState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    regionId?: string[];
  };
}

export async function createMunicipio(
  prevState: CreateMunicipioState,
  formData: FormData
): Promise<CreateMunicipioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = insertMunicipioSchema.safeParse({
      nombre: formData.get("nombre") as string,
      regionId: formData.get("regionId") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(municipios).values(validatedFields.data);
    
    revalidatePath("/admin/municipios");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/municipios");
}
