"use server";

import { db } from "@/lib/db";
import { municipios } from "@/schema/municipios";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateMunicipioSchema = createSelectSchema(municipios).partial().required({ id: true });

export interface UpdateMunicipioState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
    regionId?: string[];
  };
}

export async function updateMunicipio(
  prevState: UpdateMunicipioState,
  formData: FormData
): Promise<UpdateMunicipioState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = updateMunicipioSchema.safeParse({
      id: formData.get("id") as string,
      nombre: formData.get("nombre") as string,
      regionId: formData.get("regionId") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(municipios)
      .set(validatedFields.data)
      .where(eq(municipios.id, validatedFields.data.id));

    revalidatePath("/admin/municipios");
    revalidatePath("/admin/municipios/" + validatedFields.data.id);
    revalidatePath("/admin/municipios/" + validatedFields.data.id + "/edit");

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
