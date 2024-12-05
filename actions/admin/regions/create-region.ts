"use server";

import { db } from "@/lib/db";
import { regiones } from "@/schema/regions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/services/authorization-service";

const insertRegionSchema = createInsertSchema(regiones);

export interface CreateRegionState extends BaseActionState {
  errors?: {
    id?: string[];
    nombre?: string[];
  };
}

export async function createRegion(
  prevState: CreateRegionState,
  formData: FormData
): Promise<CreateRegionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (!isAdmin(session)) {
      throw new Error("unauthorized");
    }

    const validatedFields = insertRegionSchema.safeParse({
      nombre: formData.get("nombre") as string,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(regiones).values(validatedFields.data);

    revalidatePath("/admin/regiones");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }

  redirect("/admin/regiones");
}
