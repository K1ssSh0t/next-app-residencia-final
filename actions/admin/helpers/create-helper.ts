"use server";

import { db } from "@/lib/db";
import { helpers } from "@/schema/helpers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createInsertSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const insertHelperSchema = createInsertSchema(helpers);

export interface CreateHelperState extends BaseActionState {
  errors?: {
    id?: string[];
    estadoCuestionario?: string[];
  };
}

export async function createHelper(
  prevState: CreateHelperState,
  formData: FormData
): Promise<CreateHelperState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }


    const validatedFields = insertHelperSchema.safeParse({
      estadoCuestionario: !!formData.get("estadoCuestionario"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db.insert(helpers).values(validatedFields.data);
    
    revalidatePath("/admin/helpers");
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    }
  }

  redirect("/admin/helpers");
}
