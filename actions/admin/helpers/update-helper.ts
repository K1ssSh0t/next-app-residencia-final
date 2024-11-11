"use server";

import { db } from "@/lib/db";
import { helpers } from "@/schema/helpers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createSelectSchema } from "drizzle-zod";
import { BaseActionState } from "@/lib/types";
import { auth } from "@/lib/auth";

const updateHelperSchema = createSelectSchema(helpers)
  .partial()
  .required({ id: true });

export interface UpdateHelperState extends BaseActionState {
  errors?: {
    id?: string[];
    estadoCuestionario?: string[];
  };
}

export async function updateHelper(
  prevState: UpdateHelperState,
  formData: FormData
): Promise<UpdateHelperState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("unauthenticated");
    }

    if (session?.user?.role !== "admin") {
      throw new Error("unauthorized");
    }

    const validatedFields = updateHelperSchema.safeParse({
      id: formData.get("id") as string,
      estadoCuestionario: formData.get("estadoCuestionario") === "true",
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        status: "invalid",
      };
    }

    await db
      .update(helpers)
      .set(validatedFields.data)
      .where(eq(helpers.id, validatedFields.data.id));

    revalidatePath("/admin/helpers");
    revalidatePath("/admin/helpers/" + validatedFields.data.id);
    revalidatePath("/admin/helpers/" + validatedFields.data.id + "/edit");

    return {
      status: "success",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
    };
  }
}
