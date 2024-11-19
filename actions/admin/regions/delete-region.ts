"use server";

import { db } from "@/lib/db";
import { regions } from "@/schema/regions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const deleteRegionSchema = createSelectSchema(regions).pick({ id: true });

export interface DeleteRegionState extends BaseActionState {
  errors?: {
    id?: string[];
  };
}

export async function deleteRegion(
  prevState: DeleteRegionState,
  formData: FormData
): Promise<DeleteRegionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = deleteRegionSchema.safeParse({
      id: formData.get("id") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.delete(regions).where(eq(regions.id, validatedFields.data.id));

    revalidatePath("/admin/regiones");
  } catch (error) {
    console.log(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/regiones");
}
