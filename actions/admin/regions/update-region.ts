"use server";

import { db } from "@/lib/db";
import { regions } from "@/schema/regions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const updateRegionSchema = createSelectSchema(regions).partial().required({ id: true });

export interface UpdateRegionState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
  };
}

export async function updateRegion(
  prevState: UpdateRegionState,
  formData: FormData
): Promise<UpdateRegionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }


    const validatedFields = updateRegionSchema.safeParse({
      id: formData.get("id") as string,
      nombre: formData.get("nombre") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(regions)
      .set(validatedFields.data)
      .where(eq(regions.id, validatedFields.data.id));

    revalidatePath("/admin/regions");
    revalidatePath("/admin/regions/" + validatedFields.data.id);
    revalidatePath("/admin/regions/" + validatedFields.data.id + "/edit");

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
